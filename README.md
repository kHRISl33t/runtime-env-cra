# Runtime-env-cra

A runtime environment handler for React.js apps that have been bootstraped using [create-react-app](https://github.com/facebook/create-react-app).

- [Usage](#usage)
- [Requirements](#requirements)
- [CLI Options](#cli-options)
- [Using in a Typescript app](#typescript-usage)
- [Usage in docker](#usage-in-docker)

## Usage

- Installation

```sh
$ npm install runtime-env-cra
```

- Add the following to `public/index.html` inside the `<head>` tag:

```html
    <!-- Runtime environment variables -->
    <script src="%PUBLIC_URL%/runtime-env.js"></script>
```

- Modify your `start` script to the following in your `package.json`:

```json
...
"scripts": {
  "start": "NODE_ENV=development runtime-env-cra --config-name=./public/runtime-env.js && react-scripts start",
  ...
}
...
```

The script parses everything based on your `.env` file and adds it to `window.__RUNTIME_CONFIG__`.
If you pass `NODE_ENV=DEVELOPMENT` for the script, it will use the values from your `.env`, but if you provide anything else than `DEVELOPMENT` or nothing for `NODE_ENV` it will parse environment variables from `process.env`. This way you can dynamically set your environment variables in production/staging environments without the need to rebuild your project.

## Requirements

This script uses your `.env` file by default to parse the environment variables to `window.__RUNTIME_CONFIG__`, so be sure to have one in your project! After modifying the `start` script and `public/index.html` described in the section above, you should be good to go!

## CLI options

- Display the help section.

```sh
$ runtime-env-cra --help | -h
```

- Relative path and file name that will be generated. Default is `./runtime-env.js`

```sh
$ runtime-env-cra --config-name | -cn
```

- Relative path and name of your `env` file. Default is `./.env`

```sh
$ runtime-env-cra --env-file | -ef
```

## Typescript usage

- Create `./src/types/globals.ts` file and pase the following (**modify the `__RUNTIME_CONFIG__` properties to match your environment**):

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

- Add `"include": ["src/types"]` to your `tsconfig.json`.

```json
{
  "compilerOptions": { ... },
  "include": ["src/types"]
}
```


## Usage in Docker

You must have an example of your `.env` layout. A project usually have a `.env.example` which represents that. Inside a docker container we can lean on the `.env.example`. **Make sure your `.env.example` is always represents the correct format!**

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
