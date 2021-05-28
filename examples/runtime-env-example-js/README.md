This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Runtime-env-example-js

## Requirements

- Node 12 or greater

## Usage

```sh
$ npm i
$ npm start
```

- Open [http://localhost:3000](http://localhost:3000), to check out the result.

## Docker

```sh
$ docker build -t runtime-env-example-ts:v1 .
$ docker run -p 80:80 -e "API_URL=https://changed-api-url.com" -e "NODE_ENV=production" runtime-env-example-ts:v1
```

- Open [http://localhost:80](http://localhost:80), to check out the result.

## Docker-compose

```sh
$ docker-compose up
```

- Open [http://localhost:80](http://localhost:80), to check out the result.
