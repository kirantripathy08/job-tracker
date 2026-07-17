#!/usr/bin/env bash
# Full deploy script: run from the job-tracker/ root: bash infra/scripts/deploy.sh
#
# What this does, in order:
#   1. Reads live values (API URL, S3 bucket, CloudFront ID) straight from Terraform state
#      instead of hardcoding them — so this script keeps working even if infra changes.
#   2. Builds the React frontend with the real API URL baked in.
#   3. Uploads the build to S3.
#   4. Invalidates CloudFront's cache so it serves the new files immediately
#      (CloudFront caches aggressively — without this step you'd see stale content).

set -e  # stop on first error, don't limp forward with a half-broken deploy

INFRA_DIR="infra"
FRONTEND_DIR="frontend"

echo "Reading Terraform outputs..."
API_URL=$(terraform -chdir="$INFRA_DIR" output -raw api_url)
S3_BUCKET=$(terraform -chdir="$INFRA_DIR" output -raw s3_bucket_name)
CLOUDFRONT_ID=$(terraform -chdir="$INFRA_DIR" output -raw cloudfront_distribution_id)

echo "  API URL:      $API_URL"
echo "  S3 bucket:    $S3_BUCKET"
echo "  CloudFront ID: $CLOUDFRONT_ID"

echo "Building frontend with production API URL..."
echo "VITE_API_URL=$API_URL" > "$FRONTEND_DIR/.env.production"
(cd "$FRONTEND_DIR" && npm run build)

echo "Uploading to S3..."
aws s3 sync "$FRONTEND_DIR/dist" "s3://$S3_BUCKET" --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"

FRONTEND_URL=$(terraform -chdir="$INFRA_DIR" output -raw frontend_url)
echo ""
echo "Deploy complete."
echo "Frontend live at: $FRONTEND_URL"
echo "(CloudFront invalidation can take 1-2 minutes to fully propagate)"
