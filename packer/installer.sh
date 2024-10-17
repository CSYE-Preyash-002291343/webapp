#!/bin/bash

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo "Installing PostgreSQL 16.4..."
wget -qO - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | sudo tee /usr/share/keyrings/postgresql-archive-keyring.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Setup PostgreSQL
echo "Creating database ..."
sudo -u postgres psql -c "CREATE DATABASE CSYE-6225;"
echo "Updating PostgreSQL user password..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Banana@98';" 

# Creating user group
echo "Creating user 'csye6225' with no login shell..."
sudo groupadd csye6225
sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225