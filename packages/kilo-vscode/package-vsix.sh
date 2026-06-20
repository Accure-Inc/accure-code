#!/bin/bash
set -e

# Rebuild webviews and package extension as VSIX
echo "1. Building production bundle using esbuild..."
bun run esbuild.js --production

echo "2. Packaging extension using vsce..."
npx @vscode/vsce package --no-dependencies

echo "Packaging complete!"
