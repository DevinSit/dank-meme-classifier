.PHONY: test test-cov type-check lint ci


#################################################################################
# GLOBALS
#################################################################################

CACHE = 
DOCKER_PYTHON = docker run $$(docker build -q $(CACHE) .) python3 -m

#################################################################################
# COMMANDS
#################################################################################

## Runs the whole test suite
test:
	$(DOCKER_PYTHON) pytest src

## Runs the test suite locally (i.e. outside of Docker)
test-local:
	PYTHONPATH=./src pipenv run python3 -m pytest src

## Runs the whole test suite and produces a command line coverage report
test-cov:
	$(DOCKER_PYTHON) pytest --cov-config=setup.cfg --cov=src src

## Runs the whole test suite locally with test coverage
test-cov-local:
	PYTHONPATH=./src pipenv run python3 -m pytest --cov-config=setup.cfg --cov=src src

## Runs the static type checker
type-check:
	$(DOCKER_PYTHON) mypy src

## Runs the static type checker locally
type-check-local:
	MYPYPATH="$$(pwd)/src" pipenv run python3 -m mypy src

## Runs the flake8 linter and static type checker
lint: type-check
	$(DOCKER_PYTHON) flake8 src

## Runs the flake8 linter and static type checker locally
lint-local: type-check-local
	pipenv run python3 -m flake8 src

## Runs the linter and the test suite
ci: lint test-cov


#################################################################################
# SELF DOCUMENTING COMMANDS
#################################################################################

.DEFAULT_GOAL := show-help

# Inspired by <http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html>
# sed script explained:
# /^##/:
# 	* save line in hold space
# 	* purge line
# 	* Loop:
# 		* append newline + line to hold space
# 		* go to next line
# 		* if line starts with doc comment, strip comment character off and loop
# 	* remove target prerequisites
# 	* append hold space (+ newline) to line
# 	* replace newline plus comments by `---`
# 	* print line
# Separate expressions are necessary because labels cannot be delimited by
# semicolon; see <http://stackoverflow.com/a/11799865/1968>
.PHONY: show-help
show-help:
	@echo "$$(tput bold)Available rules:$$(tput sgr0)"
	@echo
	@sed -n -e "/^## / { \
		h; \
		s/.*//; \
		:doc" \
		-e "H; \
		n; \
		s/^## //; \
		t doc" \
		-e "s/:.*//; \
		G; \
		s/\\n## /---/; \
		s/\\n/ /g; \
		p; \
	}" ${MAKEFILE_LIST} \
	| LC_ALL='C' sort --ignore-case \
	| awk -F '---' \
		-v ncol=$$(tput cols) \
		-v indent=19 \
		-v col_on="$$(tput setaf 6)" \
		-v col_off="$$(tput sgr0)" \
	'{ \
		printf "%s%*s%s ", col_on, -indent, $$1, col_off; \
		n = split($$2, words, " "); \
		line_length = ncol - indent; \
		for (i = 1; i <= n; i++) { \
			line_length -= length(words[i]) + 1; \
			if (line_length <= 0) { \
				line_length = ncol - indent - length(words[i]) - 1; \
				printf "\n%*s ", -indent, " "; \
			} \
			printf "%s ", words[i]; \
		} \
		printf "\n"; \
	}' \
	| more $(shell test $(shell uname) = Darwin && echo '--no-init --raw-control-chars')
