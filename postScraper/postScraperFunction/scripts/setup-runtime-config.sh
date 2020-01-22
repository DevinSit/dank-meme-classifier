#!/bin/bash

set -e 

CONFIG_NAME="dank-meme-classifier-post-scraper-config"
CONFIG_DESCRIPTION="The runtime configuration for the Dank Meme Classifier Post Scraper."

CLIENT_ID_KEY="CLIENT_ID"
CLIENT_SECRET_KEY="CLIENT_SECRET"
USER_AGENT_KEY="USER_AGENT"
REDDIT_USERNAME_KEY="REDDIT_USERNAME"
REDDIT_PASSWORD_KEY="REDDIT_PASSWORD"

client_id=${1:-"0"}
client_secret=${2:-"0"}
user_agent=${3:-"0"}
reddit_username=${4:-"0"}
reddit_password=${5:-"0"}

# Enable the Cloud Function and Runtime Config APIs
echo -e "\n[INFO] Enabling GCP services...\n"
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable runtimeconfig.googleapis.com

# Create the runtime config resource
echo -e "\n[INFO] Creating runtime config...\n"
gcloud beta runtime-config configs create $CONFIG_NAME --description "$CONFIG_DESCRIPTION" || true

# Set the variables
echo -e "\n[INFO] Setting config variables...\n"
gcloud beta runtime-config configs variables set $CLIENT_ID_KEY "$client_id" --config-name ""$CONFIG_NAME
gcloud beta runtime-config configs variables set $CLIENT_SECRET_KEY "$client_secret" --config-name $CONFIG_NAME
gcloud beta runtime-config configs variables set $USER_AGENT_KEY "$user_agent" --config-name $CONFIG_NAME
gcloud beta runtime-config configs variables set $REDDIT_USERNAME_KEY "$reddit_username" --config-name $CONFIG_NAME
gcloud beta runtime-config configs variables set $REDDIT_PASSWORD_KEY "$reddit_password" --config-name $CONFIG_NAME
