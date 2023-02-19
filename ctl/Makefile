# Intentionally created to automate development tasks.

.DEFAULT_GOAL := articlectl

.PHONY: dockerfile
.SILENT: dockerfile
dockerfile:
	docker build \
	  --tag suckowbiz/articlectl \
	  .

.PHONY: smoketest
.SILENT: smoketest
smoketest:
	docker run \
		--tty \
		--rm \
		--name articlectl \
		--user $$(id -u):$$(id -g) \
		--volume $$PWD/../framework/articles:/articles \
		suckowbiz/articlectl articlectl bootstrap /articles/2023/1
