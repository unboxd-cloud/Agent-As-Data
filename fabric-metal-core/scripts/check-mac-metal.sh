#!/usr/bin/env bash
set -euo pipefail

echo "== Fabric Metal Core: Apple Silicon Native Check =="

OS_NAME="$(uname -s)"
ARCH_NAME="$(uname -m)"

if [ "$OS_NAME" != "Darwin" ]; then
  echo "FAIL: Fabric Mac/Metal Core expects macOS for this check. Found: $OS_NAME" >&2
  exit 1
fi

echo "PASS: macOS host detected"

if [ "$ARCH_NAME" = "arm64" ]; then
  echo "PASS: Apple Silicon native architecture detected: arm64"
else
  echo "WARN: Non-native Apple Silicon architecture detected: $ARCH_NAME"
  echo "WARN: Use arm64-native tools where possible. Rosetta/x86_64 should be fallback only."
fi

check_command() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    echo "PASS: $name found at $(command -v "$name")"
  else
    echo "WARN: $name not found"
  fi
}

check_command git
check_command node
check_command npm
check_command java
check_command mvn
check_command docker
check_command kubectl
check_command k3s

if command -v node >/dev/null 2>&1; then
  NODE_ARCH="$(node -p 'process.arch')"
  if [ "$ARCH_NAME" = "arm64" ] && [ "$NODE_ARCH" != "arm64" ]; then
    echo "WARN: Node is not Apple Silicon native. node arch=$NODE_ARCH"
  else
    echo "PASS: Node architecture: $NODE_ARCH"
  fi
fi

if command -v java >/dev/null 2>&1; then
  JAVA_INFO="$(java -XshowSettings:properties -version 2>&1 | grep 'os.arch' || true)"
  echo "INFO: Java $JAVA_INFO"
fi

check_port() {
  local port="$1"
  if lsof -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "WARN: port $port is already in use"
  else
    echo "PASS: port $port is available"
  fi
}

check_port 5173
check_port 8000

echo "== Fabric Metal Core check complete =="
