ARG BASE_IMAGE



## Frontend
FROM node:10 AS frontend-build

WORKDIR /usr/src/frontend

COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./

RUN npm run build-prod



## Backend
FROM ${BASE_IMAGE} AS runtime

ARG FFMPEG

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY ./backend/package*.json ./
RUN npm install --only=production
COPY ./backend/${FFMPEG} ${FFMPEG}
COPY ./backend .
COPY --from=frontend-build /usr/src/frontend /usr/src/frontend

RUN mkdir -p /usr/src/app/output

ENV OUTPUT_PATH /usr/src/app/output
ENV FFMPEG_PATH /usr/src/app/${FFMPEG}/ffmpeg

CMD [ "npm", "start" ]
