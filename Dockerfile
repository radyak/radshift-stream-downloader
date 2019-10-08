ARG BASE_IMAGE

FROM ${BASE_IMAGE}

ARG FFMPEG

COPY ./qemu-arm-static /usr/bin/qemu-arm-static

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY ${FFMPEG} ${FFMPEG}
COPY src src
COPY index.js .

RUN mkdir -p /usr/src/app/output

ENV OUTPUT_PATH /usr/src/app/output
ENV FFMPEG_PATH /usr/src/app/${FFMPEG}/ffmpeg

CMD [ "npm", "start" ]
