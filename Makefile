.PHONY: install

install:
	cp -a .env.example .env
	rm -rf node_modules
	npm install
