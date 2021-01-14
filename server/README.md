# Redis shopping cart API

## Prerequisites

-   Node - v12.19.0
-   NPM - v6.14.8
-   Docker - v19.03.13 (optional)

## Development

```
# Environmental variables

Copy `.env.example` to `.env` file and fill environmental variables

-   REDIS_PORT: Redis port (default: 6379)
-   REDIS_HOST: Redis host (default: 127.0.0.1)
-   REDIS_PASSWORD: Redis password (default: demo)

# Run docker compose or install redis with RedisJson module manually. You can also go to https://redislabs.com/try-free/ and obtain necessary environmental variables

docker network create global docker-compose up -d --build

# Install dependencies

npm cache clean && npm install

# Run dev server

npm run dev
```
