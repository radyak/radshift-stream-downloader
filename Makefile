#!make
include .env
export


IMAGE=radshift-stream-downloader

BASE_IMAGE_ARM32=arm32v7/node:lts-alpine
BASE_IMAGE_X86=node:lts-alpine

TAG=latest
TAG_X86=x86-latest


default:
	echo "No default goal defined"


## arm32

build.arm32: prepare
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)


## x86

build.x86: prepare clean
	docker build -t $(REPO)/$(IMAGE):$(TAG_X86) --build-arg BASE_IMAGE=$(BASE_IMAGE_X86) .

deploy.x86: build.x86
	docker tag  $(REPO)/$(IMAGE):$(TAG_X86) $(REPO)/$(IMAGE):$(TAG_X86)
	docker push $(REPO)/$(IMAGE):$(TAG_X86)

run.x86: build.x86
	docker run -p 3009:3009 -e PORT=3009 --name radshift-stream-downloader $(REPO)/$(IMAGE):$(TAG_X86)

clean:
	docker rm radshift-stream-downloader || true


## dev

run.dev.backend:
	cd backend && npm run watch

run.dev.frontend:
	cd frontend && npm start


## common

deploy.all: deploy.arm32 deploy.x86

prepare:
	git pull
