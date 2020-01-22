require_relative "services-config"
include ServicesConfig

# NOTE: Must be a GCP Project Owner to run this script.

###############################################################################
# MAIN
###############################################################################

# Confirm with user that the uninitialization should happen

print "\nThis will delete the project's service account and destroy all Terraform state. Are you sure you want to proceed (Y/n)? "
input = gets.strip.downcase

if input != "y" && input != "yes"
  puts "Exiting."
  exit 1
end

# Switch GCP projects

puts "\n[INFO] Switching to project #{PROJECT_ID}..."
system("gcloud config set project #{PROJECT_ID}")

# Delete service account

puts "\n[INFO] Switching to project #{PROJECT_ID}..."
system("gcloud config set project #{PROJECT_ID}")

puts "\n[INFO] Removing role binding of #{SERVICE_ACCOUNT_ROLE} on #{SERVICE_ACCOUNT}..."
system("
  gcloud projects remove-iam-policy-binding #{PROJECT_ID} -q \
  --member serviceAccount:#{FULLY_QUALIFIED_SERVICE_ACCOUNT} \
  --role #{SERVICE_ACCOUNT_ROLE}
")

puts "\n[INFO] Deleting service account #{SERVICE_ACCOUNT}..."
system("gcloud iam service-accounts delete -q #{FULLY_QUALIFIED_SERVICE_ACCOUNT}")

# Delete Terraform state bucket

puts "\n[INFO] Deleting Terraform state storage bucket..."
system("gsutil rm -r gs://#{PROJECT_NAME}-terraform")
