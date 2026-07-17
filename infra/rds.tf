# NOTE ON SECURITY / SCOPE TRADEOFF:
# The "correct" production pattern puts RDS in a private subnet, reachable only
# from Lambda inside the same VPC. That requires subnets, a NAT gateway (which
# costs money per hour even when idle), and route tables — too much for a
# few-day crash course. Instead, RDS is publicly accessible, restricted to:
#   1. Your own IP (for local psql access / debugging)
#   2. Open access on 5432 for Lambda, since Lambda's outbound IP isn't static
#      unless it's placed in a VPC with a NAT gateway.
# This is a real, acknowledged tradeoff — call it out explicitly if asked in
# the workshop. A DB password is still required either way.

data "http" "my_ip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  my_ip_cidr = "${chomp(data.http.my_ip.response_body)}/32"
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Allow Postgres access from my IP and from Lambda"

  ingress {
    description = "Postgres from my IP (for local dev / psql access)"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [local.my_ip_cidr]
  }

  ingress {
    description = "Postgres from Lambda (not VPC-bound, so no static IP to scope to)"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-db"
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t3.micro" # free-tier eligible
  allocated_storage      = 20
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  publicly_accessible    = true
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true # fine for dev; a real prod DB should NOT set this
}
