terraform {
    backend "gcs" {
        credentials = "./dmc-predict-pipeline-account.json"
        bucket = "dmc-predict-pipeline-terraform"
    }
}

provider "google" {
    credentials = "./dmc-predict-pipeline-account.json"
    project = "${var.gcp_project}"
    region = "${var.region}"
}

resource "google_pubsub_topic" "dank_predictions_topic" {
    name = "${var.project_codename}-dank-predictions-topic"
}

output "dank_predictions_topic_name" {
    value = "${google_pubsub_topic.dank_predictions_topic.name}"
}
