ARG BASE_IMAGE


## Frontend
FROM ${BASE_IMAGE} AS frontend-build

WORKDIR /usr/src/frontend

COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./

RUN npm run build-prod



## Backend
FROM ${BASE_IMAGE} AS runtime

RUN apk add --no-cache ffmpeg

RUN apk add --update \
    python \
    py-pip \
  && pip install -U virtualenv youtube_dl \
  && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY ./backend/package*.json ./
RUN npm install --only=production

COPY ./backend/src src
COPY ./backend/index.js .

COPY --from=frontend-build /usr/src/frontend/dist/frontend /usr/src/frontend/dist/frontend

RUN mkdir -p /usr/src/app/output

ENV OUTPUT_PATH /usr/src/app/output

CMD [ "npm", "start" ]
