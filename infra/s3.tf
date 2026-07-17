# This bucket stores your built frontend (the output of `npm run build`).
# It's kept PRIVATE — CloudFront is the only thing allowed to read from it.
# This is the modern, secure pattern (vs. the older "public S3 website hosting" approach).

resource "aws_s3_bucket" "frontend" {
  bucket = "${var.project_name}-frontend-${data.aws_caller_identity.current.account_id}"
}

data "aws_caller_identity" "current" {}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = true
  block_public_policy     = false # we need a policy that allows CloudFront specifically
  ignore_public_acls      = true
  restrict_public_buckets = false
}

# Bucket policy: only requests coming through OUR CloudFront distribution can read objects.
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.frontend]
}
