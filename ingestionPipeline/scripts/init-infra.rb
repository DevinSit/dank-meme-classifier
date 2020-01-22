require_relative "services-config"
include ServicesConfig

# NOTE: Must be a GCP Project Owner to run this script.

###############################################################################
# MAIN
###############################################################################

# Create a service account for the project

puts "\n[INFO] Switching to project #{PROJECT_ID}..."
system("gcloud config set project #{PROJECT_ID}")

puts "\n[INFO] Creating service account..."
system("
  gcloud iam service-accounts create #{SERVICE_ACCOUNT} \
  --display-name '#{PROJECT_TITLE} service account'
")

puts "\n[INFO] Binding service account #{SERVICE_ACCOUNT} to role #{SERVICE_ACCOUNT_ROLE}..."
system("
  gcloud projects add-iam-policy-binding #{PROJECT_ID} \
  --member serviceAccount:#{FULLY_QUALIFIED_SERVICE_ACCOUNT} \
  --role #{SERVICE_ACCOUNT_ROLE}
")

puts "\n[INFO] Getting json key for #{SERVICE_ACCOUNT}..."
system("
  gcloud iam service-accounts keys create ./#{SERVICE_ACCOUNT}.json \
  --iam-account #{FULLY_QUALIFIED_SERVICE_ACCOUNT}
")

# Add ServiceAccountTokenCreator role to running user to be able to sign JWTs to create Cloud Build triggers

puts "\n[INFO] Adding 'ServiceAccountTokenCreator' role to running user..."
account_email = `gcloud config get-value account`.strip

system("
  gcloud projects add-iam-policy-binding #{PROJECT_ID} \
  --member user:#{account_email} \
  --role #{SERVICE_ACCOUNT_TOKEN_CREATOR_ROLE}
")

# Enable APIs

puts "\n[INFO] Enabling APIs..."

APIS_TO_ENABLE.each do |api|
  system("gcloud services enable #{api}")
end

# Create the Terraform state bucket 

puts "\n[INFO] Creating storage bucket for remote Terraform state..."
system("gsutil mb gs://#{TERRAFORM_STATE_BUCKET}")

# Initialize Terraform

puts "\n[INFO] Initializing Terraform..."
system("terraform init")

# Allow the Cloud Build service account to deploy to Kubernetes

puts "\n[INFO] Allowing Cloud Build service account to deploy to Kubernetes..."

project_number=`gcloud projects describe #{PROJECT_ID} --format="value(projectNumber)"`.strip
system("
  gcloud projects add-iam-policy-binding #{PROJECT_ID} \
  --member serviceAccount:#{project_number}@cloudbuild.gserviceaccount.com \
  --role #{CONTAINER_ADMIN_ROLE}
")
