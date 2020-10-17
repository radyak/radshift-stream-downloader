#!make

REPO=radyak
IMAGE=radshift-stream-downloader

BASE_IMAGE=node:lts-alpine

TAG=latest

default: release



build: prepare clean
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE) .

publish: build
	docker login
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)

release: release.patch

release.patch: version.patch publish

release.minor: version.minor publish

release.major: version.major publish

run: build
	docker run -p 3009:3009 -e PORT=3009 --name radshift-stream-downloader $(REPO)/$(IMAGE):$(TAG)

clean:
	docker rm radshift-stream-downloader || true

version.patch:
	cd backend && npm version patch
	git add -A && git commit -m "Increase patch version"

version.minor:
	cd backend && npm version minor
	git add -A && git commit -m "Increase minor version"

version.major:
	cd backend && npm version major
	git add -A && git commit -m "Increase major version"

## dev

run.dev.backend:
	cd backend && npm run watch

run.dev.frontend:
	cd frontend && npm start


## common

prepare:
	git pull
