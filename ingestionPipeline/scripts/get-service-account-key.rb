require_relative "services-config"
include ServicesConfig

# Get service account key
puts "\n[INFO] Switching to project #{PROJECT_ID}..."
system("gcloud config set project #{PROJECT_ID}")

puts "\n[INFO] Getting json key for #{SERVICE_ACCOUNT}..."
system("gcloud iam service-accounts keys create ./#{SERVICE_ACCOUNT}.json --iam-account #{FULLY_QUALIFIED_SERVICE_ACCOUNT}")
