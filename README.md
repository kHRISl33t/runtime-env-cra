# Runtime-env-cra

A runtime environment handler for create-react-apps.

## Usage

```sh
$ npm install runtime-env-cra
```

Add the following to `public/index.html` inside the `<head>` tag:

```html
    <!-- Runtime environment variables -->
    <script src="%PUBLIC_URL%/runtime-env.js"></script>
```

Modify your start scripts for the following in your `package.json`:

```json
...
"scripts": {
  "start": "NODE_ENV=development runtime-env-cra --config-name=./public/runtime-env.js && react-scripts start",
  ...
}
```

## Requirements

This script uses your `.env` file by default to parse the environment variables to `window.__RUNTIME_CONFIG__`, so make sure you have one! After modifying the `start` script, you should be good to go!

## Usage inside Docker

You must have an example of your `.env` layout. A project usually have a `.env.example` which represents that. Inside a docker container we can relay on that.

```Dockerfile
# build
FROM node:12.13.0-alpine as build

WORKDIR /usr/src/app

COPY package* ./
COPY . .

RUN npm i
RUN npm run build

# release
FROM nginx:stable-alpine as release

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/scripts /usr/share/nginx/html/scripts
COPY --from=build /usr/src/app/.env.example /usr/share/nginx/html/.env
COPY --from=build /usr/src/app/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN apk add --update nodejs

RUN npm i -g runtime-env-cra

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["runtime-env-cra && nginx -g \"daemon off;\""]
```

## Using TypeScript

- Create `./src/types/globals.ts` file and pase the following: 

```typescript
export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      API_URL: string;
      NODE_ENV: string;
    };
  }
}
```

- Modify the `__RUNTIME_CONFIG__` properties to match your `.env` file.
