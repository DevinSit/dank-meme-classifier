#!/bin/sh

TOPIC=dank-meme-classifier-dank-predictions-topic

gcloud beta functions deploy kerasPredictionsSubscriberFunction \
    --runtime nodejs8 \
    --trigger-topic $TOPIC \
    --env-vars-file .env.yaml \
    --timeout 300s \
    --memory 256MB
