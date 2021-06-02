# Tutorial: A Shopping Cart app in NodeJS and RedisJSON

## Technical Stack

- Frontend - Vue.js
- Backend - NodeJS, ExpressJS, Redis(RedisJSON)

This shopping cart is using Redis and RedisJSON module functionalities, allowing you to save JSON as keys using methods like json_get and json_set.


## How it works

### How the data is stored:

* The products data is stored in external json file. After first request this data is saved in a JSON data type in Redis like: `JSON.SET product:{productId} . '{ "id": "productId", "name": "Product Name", "price": "375.00", "stock": 10 }'`.
    * E.g `JSON.SET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 . '{ "id": "e182115a-63d2-42ce-8fe0-5f696ecdfba6", "name": "Brilliant Watch", "price": "250.00", "stock": 2 }'`
* The cart data is stored in a hash like: `HSET cart:{cartId} product:{productId} {productQuantity}`, where cartId is random generated value and stored in user session.
    * E.g `HSET cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 1`

### How the data is modified:
* The product data is modified like `JSON.SET product:{productId} . '{ "id": "productId", "name": "Product Name", "price": "375.00", "stock": {newStock} }'`.
    * E.g `JSON.SET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 . '{ "id": "e182115a-63d2-42ce-8fe0-5f696ecdfba6", "name": "Brilliant Watch", "price": "250.00", "stock": 1 }'`
* The cart data is modified like `HSET cart:{cartId} product:{productId} {newProductQuantity}` or `HINCRBY cart:{cartId} product:{productId} {incrementBy}`.
    * E.g `HSET cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 2`
    * E.g `HINCRBY cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 1`
    * E.g `HINCRBY cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 -1`
* Product can be removed from cart like `HDEL cart:{cartId} product:{productId}`
    * E.g `HDEL cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6`
* Cart can be cleared using `HGETALL cart:{cartId}` and then `HDEL cart:{cartId} {productKey}` in loop.
    * E.g `HGETALL cart:77f7fc881edc2f558e683a230eac217d` => `product:e182115a-63d2-42ce-8fe0-5f696ecdfba6`, `product:f9a6d214-1c38-47ab-a61c-c99a59438b12`, `product:1f1321bb-0542-45d0-9601-2a3d007d5842` => `HDEL cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6`, `HDEL cart:77f7fc881edc2f558e683a230eac217d product:f9a6d214-1c38-47ab-a61c-c99a59438b12`, `HDEL cart:77f7fc881edc2f558e683a230eac217d product:1f1321bb-0542-45d0-9601-2a3d007d5842`
* All carts can be deleted when reset data is requested like: `SCAN {cursor} MATCH cart:*` and then `DEL cart:{cartId}` in loop.
    * E.g `SCAN {cursor} MATCH cart:*` => `cart:77f7fc881edc2f558e683a230eac217d`, `cart:217dedc2f558e683a230eac77f7fc881`, `cart:1ede77f558683a230eac7fc88217dc2f` => `DEL cart:77f7fc881edc2f558e683a230eac217d`, `DEL cart:217dedc2f558e683a230eac77f7fc881`, `DEL cart:1ede77f558683a230eac7fc88217dc2f` 

### How the data is accessed:
* Products: `SCAN {cursor} MATCH product:*` to get all product keys and then `JSON.GET {productKey}` in loop.
    * E.g `SCAN {cursor} MATCH product:*` => `product:e182115a-63d2-42ce-8fe0-5f696ecdfba6`, `product:f9a6d214-1c38-47ab-a61c-c99a59438b12`, `product:1f1321bb-0542-45d0-9601-2a3d007d5842` => `JSON.GET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6`, `JSON.GET product:f9a6d214-1c38-47ab-a61c-c99a59438b1`, `JSON.GET product:1f1321bb-0542-45d0-9601-2a3d007d5842`
* Cart: `HGETALL cart:{cartId}`to get quantity of products and `JSON.GET product:{productId}` to get products data in loop.
    * E.g `HGETALL cart:77f7fc881edc2f558e683a230eac217d`  => `product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 (quantity: 1)`, `product:f9a6d214-1c38-47ab-a61c-c99a59438b12 (quantity: 0)`, `product:1f1321bb-0542-45d0-9601-2a3d007d5842 (quantity: 2)` => `JSON.GET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6`, `JSON.GET product:f9a6d214-1c38-47ab-a61c-c99a59438b12`, `JSON.GET product:1f1321bb-0542-45d0-9601-2a3d007d5842`
    * HGETALL returns array of keys and corresponding values from hash data type.

## Hot to run it locally?

### Prerequisites

- Node - v12.19.0
- NPM - v6.14.8
- Docker - v19.03.13 (optional)

### Local installation

Go to server folder (`cd ./server`) and then:

```
# Environmental variables

Copy `.env.example` to `.env` file and fill environmental variables

REDIS_PORT: Redis port (default: 6379)
REDIS_HOST: Redis host (default: 127.0.0.1)
REDIS_PASSWORD: Redis password (default: demo)

cp .env.example .env

# Run docker compose or install redis with RedisJson module manually. You can also go to https://redislabs.com/try-free/ and obtain necessary environmental variables

docker network create global
docker-compose up -d --build

# Install dependencies

npm install

# Run dev server

npm run dev
```

Go to client folder (`cd ./client`) and then:

```
# Environmental variables

Copy `.env.example` to `.env` file

cp .env.example .env

# Install dependencies

npm install

# Serve locally

npm run serve
```

## Deployment

To make deploys work, you need to create free account in https://redislabs.com/try-free/, create Redis instance with `RedisJson` module and get informations - REDIS_ENDPOINT_URI and REDIS_PASSWORD. You must pass them as environmental variables.

### Google Cloud Run

[![Run on Google
Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/redis-developer/basic-redis-shopping-chart-nodejs.git)

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/redis-developer/basic-redis-shopping-chart-nodejs&env=REDIS_ENDPOINT_URI,REDIS_PASSWORD)
