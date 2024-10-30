#!/bin/bash

# Installing cloud watch agent for AWS
sudo yum install amazon-cloudwatch-agent

# Set up CloudWatch Agent configuration
echo "Creating CloudWatch Agent configuration file..."
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOF
{
  "agent": {
      "metrics_collection_interval": 10,
      "logfile": "/var/logs/amazon-cloudwatch-agent.log"
  },
  "logs": {
      "logs_collected": {
          "files": {
              "collect_list": [
                  {
                      "file_path": "/opt/webapp/logs/webapp.log",
                      "log_group_name": "webapp",
                      "log_stream_name": "API-Server",
                  }
              ]
          }
      }
  },
  "log_stream_name": "cloudwatch_log_stream"
},
"metrics": {
  "metrics_collected": {
     "statsd": {
        "service_address": ":8125",
        "metrics_collection_interval": 15,
        "metrics_aggregation_interval": 300
     }
  }
}
}
EOF

# Fetch and apply the CloudWatch Agent configuration, then start the agent
echo "Starting Amazon CloudWatch Agent with specified configuration..."
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

# Enable the CloudWatch Agent to start on system boot
sudo systemctl enable amazon-cloudwatch-agent

echo "CloudWatch Agent setup complete."
