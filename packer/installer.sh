#!/bin/bash

# Install Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Creating user group
echo "Creating user 'csye6225' with no login shell..."
sudo groupadd csye6225
sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225