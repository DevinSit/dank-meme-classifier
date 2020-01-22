.PHONY: start deploy setup-runtime-config

start:
	npm start

deploy:
	bash ./scripts/deploy.sh

setup-runtime-config:
	bash ./scripts/setup-runtime-config.sh $(CLIENT_ID) $(CLIENT_SECRET) $(USER_AGENT) $(REDDIT_USERNAME) $(REDDIT_PASSWORD)
