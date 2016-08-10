.PHONY: install

install: _copyenv _npmi _setupdb
update: _npmi _setupdb

_copyenv:
	cp .env.example .env

_npmi:
	rm -rf node_modules
	npm install

_setupdb:
	node --harmony_proxies ace migration:refresh
	node --harmony_proxies ace db:seed
