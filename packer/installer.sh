#!/bin/bash

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo "Installing PostgreSQL .."
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Setup PostgreSQL
echo "Creating database ..."
sudo -u postgres psql -c "CREATE DATABASE "CSYE625webapp";"
echo "Updating PostgreSQL user password..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'Banana@98';" 

# Creating user group
echo "Creating user 'csye6225' with no login shell..."
sudo groupadd csye6225
sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225