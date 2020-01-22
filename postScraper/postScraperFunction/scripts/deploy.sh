#!/bin/sh

gcloud beta functions deploy postScraperFunction --runtime nodejs8 --trigger-http --env-vars-file .env.yaml
