const { StatusCodes } = require('http-status-codes');
const { products } = require('../../products.json');

class IndexProductsController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { resetCode } = req.query;

        const cartKeys = await this.redisClientService.eachScan('product:*');

        if (!resetCode && cartKeys.length) {
            const productKeys = await this.redisClientService.eachScan('product:*');
            let productList = [];

            for (const key of productKeys) {
                const product = await this.redisClientService.jsonGet(key);

                productList.push(JSON.parse(product));
            }

            return res.send(productList);
        }

        const { DATA_RESET_CODE } = process.env;

        if (resetCode === DATA_RESET_CODE || !cartKeys.length) {
            for (const product of products) {
                const { id } = product;

                await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));
            }

            for (const key of cartKeys) {
                await this.redisClientService.redis.hdel(`product:${id}`, key);
            }

            return res.send(products);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send('Reset code is not valid');
        }
    }
}

module.exports = IndexProductsController;
