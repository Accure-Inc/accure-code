#!/bin/bash
set -e

echo "1. Preparing CLI binary..."
bun run prepare:cli-binary

echo "2. Rebuilding SDK..."
bun run rebuild-sdk

echo "3. Building production bundle using esbuild..."
bun run esbuild.js --production

echo "4. Packaging extension using vsce..."
npx @vscode/vsce package --no-dependencies

echo "Packaging complete!"
