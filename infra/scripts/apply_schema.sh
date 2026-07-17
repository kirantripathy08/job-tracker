#!/usr/bin/env bash
# One-time setup: applies schema.sql to the RDS instance in the cloud.
# Run from job-tracker/ root: bash infra/scripts/apply_schema.sh
#
# Note: this is separate from your LOCAL Postgres — RDS starts empty.

set -e

INFRA_DIR="infra"
RDS_ENDPOINT=$(terraform -chdir="$INFRA_DIR" output -raw rds_endpoint)

echo "Applying schema to RDS at $RDS_ENDPOINT..."
echo "(You'll be prompted for the DB password you set in terraform.tfvars)"

psql -h "$RDS_ENDPOINT" -U postgres -d jobtracker -f backend/schema.sql

echo "Schema applied."
