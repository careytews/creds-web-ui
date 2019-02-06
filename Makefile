
VERSION=$(shell git describe | sed 's/^v//')

CONTAINER=gcr.io/trust-networks/creds-web-ui:${VERSION}

all: container

.npm_install: package.json package-lock.json
	npm install
	touch .npm_install

container: .npm_install
	PATH=${PATH}:$$(pwd)/node_modules/.bin ng build --prod
	docker build -t ${CONTAINER} -f Dockerfile .

test: .npm_install
	PATH=${PATH}:$$(pwd)/node_modules/.bin ng test --watch=false
	PATH=${PATH}:$$(pwd)/node_modules/.bin ng e2e

.PHONY: push
push:
	gcloud docker -- push ${CONTAINER}
