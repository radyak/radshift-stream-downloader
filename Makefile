#!make

IMAGE=radshift-stream-downloader

BASE_IMAGE_ARM32=arm32v7/node:lts-alpine
BASE_IMAGE_X86=node:lts-alpine

TAG=latest
TAG_X86=x86-latest


default: build.arm32


## arm32

build.arm32: prepare
	docker build -t $(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(IMAGE):$(TAG) $(IMAGE):$(TAG)
	docker push $(IMAGE):$(TAG)


## x86

build.x86: prepare clean
	docker build -t $(IMAGE):$(TAG_X86) --build-arg BASE_IMAGE=$(BASE_IMAGE_X86) .

deploy.x86: build.x86
	docker tag  $(IMAGE):$(TAG_X86) $(IMAGE):$(TAG_X86)
	docker push $(IMAGE):$(TAG_X86)

run.x86: build.x86
	docker run -p 3009:3009 -e PORT=3009 --name radshift-stream-downloader $(IMAGE):$(TAG_X86)

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
