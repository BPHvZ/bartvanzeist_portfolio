#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
OUTPUT_PATH="$ROOT_DIR/static/CV_-_Bart_van_Zeist.pdf"
LOCAL_DOTNET="$ROOT_DIR/.dotnet/dotnet"
ALLOW_EXISTING_OUTPUT=0

if [ "${1:-}" = "--allow-existing-output" ]; then
  ALLOW_EXISTING_OUTPUT=1
  shift
fi

has_any_sdk() {
  "$1" --list-sdks 2>/dev/null | grep -Eq '^[0-9]'
}

has_net8_runtime() {
  "$1" --list-runtimes 2>/dev/null | grep -Eq '^Microsoft\.NETCore\.App 8\.'
}

can_run_cv_generator() {
  [ -x "$1" ] && has_any_sdk "$1" && has_net8_runtime "$1"
}

install_local_dotnet() {
  INSTALL_DIR="$ROOT_DIR/.dotnet"
  INSTALL_SCRIPT="$ROOT_DIR/.dotnet-install.sh"

  mkdir -p "$INSTALL_DIR"

  if [ ! -f "$INSTALL_SCRIPT" ]; then
    curl -fsSL https://dot.net/v1/dotnet-install.sh -o "$INSTALL_SCRIPT"
  fi

  sh "$INSTALL_SCRIPT" --channel 8.0 --install-dir "$INSTALL_DIR"
}

resolve_dotnet_cmd() {
  if can_run_cv_generator "$LOCAL_DOTNET"; then
    printf '%s\n' "$LOCAL_DOTNET"
    return 0
  fi

  if command -v dotnet >/dev/null 2>&1; then
    SYSTEM_DOTNET=$(command -v dotnet)
    if can_run_cv_generator "$SYSTEM_DOTNET"; then
      printf '%s\n' "$SYSTEM_DOTNET"
      return 0
    fi
  fi

  install_local_dotnet

  if can_run_cv_generator "$LOCAL_DOTNET"; then
    printf '%s\n' "$LOCAL_DOTNET"
    return 0
  fi

  echo "Unable to locate a dotnet installation that can build and run net8.0 projects." >&2
  return 1
}

run_generator() {
  DOTNET_CMD=$(resolve_dotnet_cmd) || return 1
  "$DOTNET_CMD" run --project "$ROOT_DIR/scripts/cv-generator/CvGenerator.csproj" --configuration Release -- "$@"
}

set +e
run_generator "$@"
STATUS=$?
set -e

if [ "$STATUS" -eq 0 ]; then
  exit 0
fi

if [ "$ALLOW_EXISTING_OUTPUT" -eq 1 ] && [ -f "$OUTPUT_PATH" ]; then
  echo "Warning: CV regeneration failed; reusing existing static/CV_-_Bart_van_Zeist.pdf" >&2
  exit 0
fi

exit "$STATUS"
