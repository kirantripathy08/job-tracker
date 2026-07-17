resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Basic execution policy: lets Lambda write logs to CloudWatch.
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# The zip is built by a shell script (build_lambda.sh) BEFORE terraform apply.
# Terraform just points at the resulting file — it doesn't build it itself.
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/build"
  output_path = "${path.module}/lambda_package.zip"
}

resource "aws_lambda_function" "api" {
  function_name    = "${var.project_name}-api"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "lambda_handler.handler"
  runtime          = "python3.12"
  role             = aws_iam_role.lambda_exec.arn
  timeout          = 30
  memory_size      = 256

  environment {
    variables = {
      DATABASE_URL = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.address}:5432/${var.db_name}"
    }
  }
}
