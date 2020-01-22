require "yaml"

module ServicesConfig
  # Configuration values

  PROJECT_TITLE = "Dank Meme Classifier Ingestion Pipeline"
  PROJECT_NAME = "dmc-ingestion-pipeline"
  PROJECT_ID = "devinsit-personal-projects"
  PROJECT_ZONE = "us-east4-a"

  SERVICE_ACCOUNT = "#{PROJECT_NAME}-account"
  SERVICE_ACCOUNT_ROLE = "roles/editor"
  FULLY_QUALIFIED_SERVICE_ACCOUNT = "#{SERVICE_ACCOUNT}@#{PROJECT_ID}.iam.gserviceaccount.com"

  SERVICE_ACCOUNT_TOKEN_CREATOR_ROLE = "roles/iam.serviceAccountTokenCreator"
  CONTAINER_ADMIN_ROLE = "roles/container.admin"

  APIS_TO_ENABLE = [
    "cloudbuild.googleapis.com",
    "compute.googleapis.com",
    "container.googleapis.com",
    "containerregistry.googleapis.com",
    "replicapool.googleapis.com",
    "replicapoolupdater.googleapis.com",
    "resourceviews.googleapis.com"
  ]

  TERRAFORM_STATE_BUCKET = "#{PROJECT_NAME}-terraform"
end
