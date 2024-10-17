packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0866a3c8686eaeeba"
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0f8936d5765c62460"
}

variable "Port" {
  type    = number
}

variable "db_name" {
  type    = string
  default = "CSYE6225-webapp"
}

variable "db_user" {
  type    = string
  default = "postgres"
}

variable "db_pass" {
  type    = string
}

variable "db_host" {
  type    = string
}

source "amazon-ebs" "example" {
  ami_name = "test-ami-10/16"
  region   = var.aws_region

  ami_regions = ["us-east-1"]

  aws_polling {
    delay_seconds = 10
    max_attempts  = 50
  }

  instance_type = "t2.small"
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  subnet_id     = var.subnet_id

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.example"]

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp.tar.gz"
    destination = "/tmp/webapp.tar.gz"
  }

  provisioner "file" {
    source      = "/home/runner/work/webapp/webapp/.env"
    destination = "/tmp/.env"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
      "DB_PORT=${var.Port}",
      "DB_NAME=${var.db_name}",
      "DB_USER=${var.db_user}",
      "DB_PASS=${var.db_pass}",
      "DB_HOST=${var.db_host}"
    ]
    scripts = [
        "installer.sh",
        "setup.sh"
    ]
  }
}