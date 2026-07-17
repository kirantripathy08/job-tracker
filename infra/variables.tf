variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Prefix used for naming all resources"
  type        = string
  default     = "job-tracker"
}

variable "db_username" {
  description = "Master username for RDS Postgres"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Master password for RDS Postgres"
  type        = string
  sensitive   = true # Terraform hides this in plan/apply output
}

variable "db_name" {
  description = "Initial database name"
  type        = string
  default     = "jobtracker"
}
