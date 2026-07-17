output "frontend_url" {
  description = "CloudFront URL for the React frontend"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "api_url" {
  description = "API Gateway URL for the FastAPI backend"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "rds_endpoint" {
  description = "RDS Postgres endpoint (for psql access if needed)"
  value       = aws_db_instance.postgres.address
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (needed for cache invalidation on deploy)"
  value       = aws_cloudfront_distribution.frontend.id
}

output "s3_bucket_name" {
  description = "S3 bucket name (used by the deploy script to sync build files)"
  value       = aws_s3_bucket.frontend.bucket
}
