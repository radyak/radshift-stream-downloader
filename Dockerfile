ARG BASE_IMAGE

FROM ${BASE_IMAGE}

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
COPY . .

ENV OUTPUT_PATH /usr/src/app/output

CMD [ "npm", "start" ]
