.PHONY: start start-keras-predictions-subscriber-function init-infra uninit-infra get-service-account-key

start-keras-predictions-subscriber-function:
	$(MAKE) -C kerasPredictionsSubscriberFunction start

init-infra:
	ruby ./scripts/init-infra.rb

uninit-infra:
	ruby ./scripts/uninit-infra.rb

get-service-account-key:
	ruby ./scripts/get-service-account-key.rb
