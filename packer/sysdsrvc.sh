#!/bin/bash
# Variables
TMP_DIR="/tmp"
SRC="/opt/src"
NAME="webapp"
APP_ZIP="webapp.tar.gz"
APP_CODE_DIR="$SRC/$NAME"
SERVICE_FILE="/etc/systemd/system/packer-webapp.service"
ENV_FILE="$APP_CODE_DIR/.env"

# Fetch Code
echo "Extracting code..."
sudo mkdir -p $SRC
sudo tar -xzf $TMP_DIR/$APP_ZIP -C $SRC
sudo mv $TMP_DIR/.env $APP_CODE_DIR/.env

# Change ownership of application artifacts
sudo chown -R csye6225:csye6225 $APP_CODE_DIR

# Install dependencies
cd $APP_CODE_DIR && sudo npm install

# Create service
echo "Creating boot service..."
sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=webapp
ConditionPathExists=$ENV_FILE
After=network.target

[Service]
Environment=NODE_PORT=$PORT
EnvironmentFile=$ENV_FILE
Type=simple
User=csye6225
Group=csye6225
workingDirectory=$APP_CODE_DIR
ExecStart=/usr/bin/node $APP_CODE_DIR/app.js
Restart=always
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable packer-webapp
sudo systemctl start packer-webapp
echo "Service packer-webapp created. Application will run on boot."