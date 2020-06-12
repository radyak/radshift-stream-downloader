#!make

REPO=radyak
IMAGE=radshift-stream-downloader

BASE_IMAGE=node:lts-alpine

TAG=latest

default: release



build: prepare clean
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE) .

release: build
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)

run: build
	docker run -p 3009:3009 -e PORT=3009 --name radshift-stream-downloader $(IMAGE):$(TAG)

clean:
	docker rm radshift-stream-downloader || true


## dev

run.dev.backend:
	cd backend && npm run watch

run.dev.frontend:
	cd frontend && npm start


## common

prepare:
	git pull
