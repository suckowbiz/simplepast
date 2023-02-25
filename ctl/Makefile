# Intentionally created to automate development tasks.

.DEFAULT_GOAL := smoketest

.PHONY: dockerfile
.SILENT: dockerfile
dockerfile:
	docker build --tag suckowbiz/articlectl .

.PHONY: smoketest
.SILENT: smoketest
smoketest: dockerfile
	docker run \
		--tty \
		--user $$(id -u):$$(id -g) \
		--volume $$PWD/../smoketest/articles:/articles \
		suckowbiz/articlectl mogrify /articles/2023/1
