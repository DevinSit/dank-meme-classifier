#!/bin/bash

set -e

GCP_PROJECT_ID=devinsit-personal-projects
PROJECT_NAME=dank-meme-classifier
SERVICE_ACCOUNT=$PROJECT_NAME-account
FULLY_QUALIFIED_ACCOUNT_NAME=$SERVICE_ACCOUNT@$GCP_PROJECT_ID.iam.gserviceaccount.com

# Get service account key
echo -e "\n[INFO] Switching to project $GCP_PROJECT_ID...\n"
gcloud config set project $GCP_PROJECT_ID

echo -e "\n[INFO] Getting json key for $SERVICE_ACCOUNT...\n"
gcloud iam service-accounts keys create ./$SERVICE_ACCOUNT.json \
    --iam-account $FULLY_QUALIFIED_ACCOUNT_NAME
