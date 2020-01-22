#!/bin/sh

TOPIC=dank-meme-classifier-posts-topic

gcloud beta functions deploy ingestionSubscriberFunction \
    --runtime nodejs8 \
    --trigger-topic $TOPIC \
    --env-vars-file .env.yaml \
    --timeout 300s \
    --memory 512MB
