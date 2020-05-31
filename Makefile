#!make

REPO=radyak
IMAGE=radshift-stream-downloader

BASE_IMAGE_ARM32=arm32v7/node:lts-alpine
BASE_IMAGE=node:lts-alpine

TAG_ARM=arm_latest
TAG=latest

default: deploy


## arm32

build.arm32: prepare
	docker build -t $(REPO)/$(IMAGE):$(TAG_ARM) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG_ARM) $(REPO)/$(IMAGE):$(TAG_ARM)
	docker push $(REPO)/$(IMAGE):$(TAG_ARM)


## x86

build: prepare clean
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE) .

deploy: build
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

deploy.all: deploy.arm32 deploy

prepare:
	git pull
