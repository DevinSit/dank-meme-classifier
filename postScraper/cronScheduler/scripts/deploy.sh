#!/bin/sh

gcloud app deploy --version=production
gcloud app deploy cron.yaml
