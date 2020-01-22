.PHONY: start start-ingestion-publisher-function start-ingestion-subscriber-function init-infra uninit-infra get-service-account-key

start:
	foreman start

start-ingestion-publisher-function:
	$(MAKE) -C ingestionPublisherFunction start

start-ingestion-subscriber-function:
	$(MAKE) -C ingestionSubscriberFunction start

init-infra:
	ruby ./scripts/init-infra.rb

uninit-infra:
	ruby ./scripts/uninit-infra.rb

get-service-account-key:
	ruby ./scripts/get-service-account-key.rb
