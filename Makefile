#!make
include .env
export


IMAGE=radshift-stream-downloader

BASE_IMAGE_ARM32=arm32v7/node:lts-alpine
BASE_IMAGE_X86=node:lts-alpine

FFMPEG_ARM32=ffmpeg-4.2.2-armhf-static
FFMPEG_X86=ffmpeg-4.1.3-i686-static

TAG=latest
TAG_X86=x86-latest


default:
	echo "No default goal defined"


## arm32

build.arm32: prepare setup
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg FFMPEG=$(FFMPEG_ARM32) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)


## x86

build.x86: prepare setup clean
	docker build -t $(REPO)/$(IMAGE):$(TAG_X86) --build-arg FFMPEG=$(FFMPEG_X86) --build-arg BASE_IMAGE=$(BASE_IMAGE_X86) .

deploy.x86: build.x86
	docker tag  $(REPO)/$(IMAGE):$(TAG_X86) $(REPO)/$(IMAGE):$(TAG_X86)
	docker push $(REPO)/$(IMAGE):$(TAG_X86)

run.x86: build.x86
	docker run -p 3009:3009 -e PORT=3009 --name radshift-stream-downloader $(REPO)/$(IMAGE):$(TAG_X86)

clean:
	docker rm radshift-stream-downloader


## dev

run.dev.backend:
	cd backend && npm run watch

run.dev.frontend:
	cd frontend && npm start


## common

deploy.all: deploy.arm32 deploy.x86

setup:
	tar xvf backend/ffmpeg/ffmpeg-release-i686-static.tar.xz -C backend
	tar xvf backend/ffmpeg/ffmpeg-release-armhf-static.tar.xz -C backend

prepare:
	git pull
