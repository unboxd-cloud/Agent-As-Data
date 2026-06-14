#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/fabricore-os/java"

echo "== Fabricore OS: Build Java CLI =="

mvn -q -DskipTests package

mkdir -p "$ROOT_DIR/dist"
cp target/fabricore-os-java-0.1.0.jar "$ROOT_DIR/dist/fabricore.jar"
shasum -a 256 "$ROOT_DIR/dist/fabricore.jar" > "$ROOT_DIR/dist/fabricore.jar.sha256"

ls -lh "$ROOT_DIR/dist/fabricore.jar" "$ROOT_DIR/dist/fabricore.jar.sha256"
cat "$ROOT_DIR/dist/fabricore.jar.sha256"

echo "== Java Fabricore built =="
echo "Run: java -jar dist/fabricore.jar check"
