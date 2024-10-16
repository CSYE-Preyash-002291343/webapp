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

variable "postgresPass" {
  type    = string
}

source "amazon-ebs" "example" {
  ami_name = "test-ami"
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
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.example"]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      # Install Node.js
      "sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash",
      "nvm install 20.14.0",
      # Install PostgreSQL
      "wget -qO - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /usr/share/keyrings/postgresql-archive-keyring.gpg > /dev/null",
      "echo \"deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main\" | sudo tee /etc/apt/sources.list.d/pgdg.list",
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt install postgresql postgresql-contrib",
      "sudo -u postgres psql",

      # Create a user and database
      "sudo -u postgres psql -c \"ALTER USER postgres WITH PASSWORD 'postgresPass';\"",
      "sudo -u postgres psql -c \"CREATE DATABASE \\\"CSYE6225-webapp\\\";\"",
      "sudo apt-get clean",
    ]
  }
}
