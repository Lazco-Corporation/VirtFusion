#!/usr/bin/env bash
set -euo pipefail

# Cut a tag-driven npm release for release-npm.yml.
#
# Usage:
#   scripts/release.sh <bump> [--dry-run]
#
#   bump      patch | minor | major | prepatch | preminor | premajor | prerelease
#             | an explicit version (1.2.3, 1.2.3-beta.0)
#   --dry-run run every check, then print the commands instead of running them
#
# `pnpm version` is the single source of truth. It bumps package.json, commits,
# and creates the `v<version>` tag in one atomic step, so package.json and the
# tag can never disagree. Pushing that tag is the entire ship action:
# release-npm.yml re-checks the version and publishes to npm.
#
# Do NOT edit the version field in package.json by hand.
#
# The script never guesses the next version. It runs `pnpm version`, reads the
# result back, and undoes the local commit and tag if a post-check fails.
# (`pnpm version --dry-run` cannot do this job: it ignores the flag and bumps,
# commits, and tags for real.)

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

# ─── Parse arguments ────────────────────────────────────────
DRY_RUN=false
POSITIONAL=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    -h | --help)
      grep -E '^#( |$)' "$0" | sed -E 's/^# ?//'
      exit 0
      ;;
    -*)
      echo "Unknown flag: $arg" >&2
      exit 1
      ;;
    *) POSITIONAL+=("$arg") ;;
  esac
done

if [ "${#POSITIONAL[@]}" -ne 1 ]; then
  echo "Usage: scripts/release.sh <patch|minor|major|prepatch|preminor|premajor|prerelease|X.Y.Z> [--dry-run]" >&2
  exit 1
fi

BUMP="${POSITIONAL[0]}"

case "$BUMP" in
  patch | minor | major | prepatch | preminor | premajor | prerelease) ;;
  *)
    if ! [[ "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]]; then
      echo "Invalid bump '$BUMP' (expected a keyword or MAJOR.MINOR.PATCH[-prerelease])" >&2
      exit 1
    fi
    ;;
esac

# ─── Preflight ──────────────────────────────────────────────
BRANCH="$(git branch --show-current)"
if [ "$BRANCH" != "main" ]; then
  echo "Releases are cut from main (current branch: ${BRANCH:-detached})." >&2
  exit 1
fi

# pnpm version refuses a dirty tree too, but fail here with a clearer message.
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Commit or stash first." >&2
  git status --short >&2
  exit 1
fi

git fetch --tags --quiet origin

# Compare against origin/main by name, not @{u}. With no upstream set, @{u}
# fails inside the command substitution below, the test reads an empty string,
# and the guard passes a diverged branch.
if ! git rev-parse --verify --quiet "refs/remotes/origin/${BRANCH}" > /dev/null; then
  echo "origin/${BRANCH} not found. Push the branch first." >&2
  exit 1
fi

if [ -n "$(git rev-list "origin/${BRANCH}..HEAD")" ] || [ -n "$(git rev-list "HEAD..origin/${BRANCH}")" ]; then
  echo "Local ${BRANCH} and origin/${BRANCH} have diverged. Pull or push first." >&2
  exit 1
fi

# The build is the gate. tsup emits declaration files through a rollup pass,
# which type-checks, so a type error fails here instead of in CI.
pnpm install
pnpm build

PKG_NAME="$(node -p "require('./package.json').name")"
CURRENT="$(node -p "require('./package.json').version")"
BASE_COMMIT="$(git rev-parse HEAD)"

if [ "$DRY_RUN" = true ]; then
  echo
  echo "  Package : ${PKG_NAME}"
  echo "  Current : ${CURRENT}"
  echo "  Bump    : ${BUMP}"
  echo "  Commit  : $(git rev-parse --short HEAD) (${BRANCH})"
  echo
  echo "[dry-run] pnpm version ${BUMP} --message 'release %s'"
  echo "[dry-run] git push --atomic origin ${BRANCH} v<new-version>"
  exit 0
fi

# ─── Bump, then verify ──────────────────────────────────────
# Tags that already exist must survive a rollback, so snapshot them first and
# delete only what this run created.
TAGS_BEFORE="$(git tag -l)"

# Roll back to the starting commit and drop any tag this run created.
# `pnpm version` is not atomic: when its tag step fails it still leaves the
# bumped package.json and its commit behind.
undo() {
  local tag
  while read -r tag; do
    [ -n "$tag" ] && git tag -d "$tag" > /dev/null 2>&1 || true
  done <<< "$(comm -13 <(printf '%s\n' "$TAGS_BEFORE" | sort) <(git tag -l | sort))"
  git reset --hard "$BASE_COMMIT" > /dev/null
}

# Writes package.json, commits, and tags v<version> in one step.
if ! pnpm version "$BUMP" --message "release %s"; then
  undo
  echo "pnpm version failed. Rolled back to $(git rev-parse --short HEAD). Nothing was pushed." >&2
  exit 1
fi

NEXT="$(node -p "require('./package.json').version")"
TAG="v${NEXT}"

# npm versions are immutable, so a duplicate would burn the whole release.
# A non-zero exit alone does not prove the version is free: a timeout, an auth
# failure, or a registry outage exits non-zero too. Only E404 means "not there".
set +e
VIEW_OUT="$(npm view "${PKG_NAME}@${NEXT}" version 2>&1)"
VIEW_RC=$?
set -e

if [ "$VIEW_RC" -eq 0 ]; then
  echo "${PKG_NAME}@${NEXT} is already on the npm registry." >&2
  undo
  echo "Rolled back the local commit and tag ${TAG}. Nothing was pushed." >&2
  exit 1
fi

if ! printf '%s' "$VIEW_OUT" | grep -q 'E404'; then
  echo "Cannot check ${PKG_NAME}@${NEXT} on the npm registry:" >&2
  printf '%s\n' "$VIEW_OUT" >&2
  undo
  echo "Rolled back the local commit and tag ${TAG}. Nothing was pushed." >&2
  exit 1
fi

DIST_TAG=latest
if [[ "$NEXT" == *-* ]]; then
  DIST_TAG=next
fi

echo
echo "  Package  : ${PKG_NAME}"
echo "  Version  : ${CURRENT} -> ${NEXT}"
echo "  Tag      : ${TAG}"
echo "  Dist-tag : ${DIST_TAG}"
echo "  Commit   : $(git rev-parse --short HEAD) (${BRANCH})"
echo

# --atomic, so a rejected tag cannot leave the release commit on origin. undo
# resets local refs only, and it cannot take back a ref that already landed.
if ! git push --atomic origin "$BRANCH" "$TAG"; then
  undo
  echo "Rolled back the local commit and tag ${TAG}. Nothing was pushed." >&2
  exit 1
fi

echo "Pushed ${TAG} - release-npm.yml will take over from here."
