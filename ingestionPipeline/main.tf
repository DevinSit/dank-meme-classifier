terraform {
    backend "gcs" {
        credentials = "./dmc-ingestion-pipeline-account.json"
        bucket = "dmc-ingestion-pipeline-terraform"
    }
}

provider "google" {
    credentials = "./dmc-ingestion-pipeline-account.json"
    project = "${var.gcp_project}"
    region = "${var.region}"
}

resource "google_storage_bucket" "images_bucket" {
    name = "${var.project_codename}-images-store"
    location = "${var.region}"
    storage_class = "REGIONAL"
}

resource "google_pubsub_topic" "posts_topic" {
    name = "${var.project_codename}-posts-topic"
}

output "images_bucket_name" {
    value = "${google_storage_bucket.images_bucket.name}"
}

output "posts_topic_name" {
    value = "${google_pubsub_topic.posts_topic.name}"
}
