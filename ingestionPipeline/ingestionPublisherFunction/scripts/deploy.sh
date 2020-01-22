#!/bin/sh

gcloud beta functions deploy ingestionPublisherFunction --runtime nodejs8 --trigger-http --env-vars-file .env.yaml
