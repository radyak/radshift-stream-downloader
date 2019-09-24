#!make


IMAGE=radshift-stream-downloader
REPO=radyak

BASE_IMAGE_ARM32=arm32v7/node:lts-slim
BASE_IMAGE_X86=node:lts-alpine

TAG=latest
TAG_X86=x86-latest


default:
	echo "No default goal defined"


## arm32

build.arm32:
	docker run --rm --privileged multiarch/qemu-user-static:register --reset
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)


## x86

build.x86:
	docker build -t $(REPO)/$(IMAGE):$(TAG_X86) --build-arg BASE_IMAGE=$(BASE_IMAGE_X86) .

deploy.x86: build.x86
	docker tag  $(REPO)/$(IMAGE):$(TAG_X86) $(REPO)/$(IMAGE):$(TAG_X86)
	docker push $(REPO)/$(IMAGE):$(TAG_X86)

run.x86: build.x86
	docker run -p 3009:3009 -e PORT=3009 -e FFMPEG_PATH=/usr/src/app/ffmpeg-4.1.3-i686-static/ffmpeg $(REPO)/$(IMAGE):$(TAG_X86)


## dev

run.dev:
	npm run watch

setup:
	tar xvf ffmpeg/ffmpeg-release-i686-static.tar.xz
	tar xvf ffmpeg/ffmpeg-release-armhf-static.tar.xz



## common

deploy.all: deploy.arm32 deploy.x86