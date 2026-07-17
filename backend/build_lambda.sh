#!/usr/bin/env bash
# Builds the Lambda deployment package.
# Run this from the backend/ directory: bash build_lambda.sh
#
# WHY --platform/--only-binary: you're likely building on Windows, but Lambda
# runs Amazon Linux (x86_64). Packages with compiled C extensions (psycopg2,
# pydantic-core) need Linux-compatible wheels, not whatever your OS would
# normally install. These flags force pip to download the correct
# pre-built Linux wheels instead of trying to compile locally.

set -e  # stop immediately if any command fails

echo "Cleaning previous build..."
rm -rf build
mkdir build

echo "Installing dependencies for Lambda (linux x86_64, python 3.12)..."
pip install -r requirements.txt \
  --target build \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.12 \
  --only-binary=:all: \
  --upgrade

echo "Copying application code..."
cp main.py models.py schemas.py database.py lambda_handler.py build/

echo "Build complete: backend/build/ is ready for terraform apply"
