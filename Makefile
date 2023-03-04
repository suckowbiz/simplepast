# Intentionally created to automate development tasks.

.DEFAULT_GOAL := smoketest

# Runs unit-tests to ensure specific issues are absent.
.PHONY: unit-tests
.SILENT: unit-tests
unit-tests:
	docker run \
		--rm \
		--name node \
		--volume "$$PWD/framework/assets/v2/js/modules":/usr/src/app \
		--workdir /usr/src/app \
		node test/unit-tests.js

.PHONY: dockerfile
.PHONY: dockerfile
dockerfile:
	docker build \
	  --tag suckowbiz/simplepast \
	  .

# The key here is that Caddy is able to listen to ports 80 and 443, both required for the ACME HTTP challenge.
.PHONY: smoketest
.PHONY: smoketest
smoketest: dockerfile
	docker run \
		--rm \
		--name simplepast \
		--user $$(id -u):$$(id -g) \
		--publish 80:80 \
		--publish 443:443 \
		--publish 443:443/udp \
		--volume $$PWD/smoketest/articles:/usr/share/caddy/articles \
		--volume $$PWD/smoketest/config.json:/usr/share/caddy/config.json \
		--volume $$PWD/smoketest/banner.png:/usr/share/caddy/banner.png \
		--volume $$PWD/smoketest/.caddy/data:/data \
		--volume $$PWD/smoketest/.caddy/config:/config \
		--volume $$PWD/smoketest/.caddy/Caddyfile:/etc/caddy/Caddyfile \
		suckowbiz/simplepast
