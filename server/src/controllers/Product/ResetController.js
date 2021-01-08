const { StatusCodes } = require('http-status-codes');
const { products } = require('../../products.json');

class ProductResetController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const cartKeys = await this.redisClientService.scan('cart:*');

        for (const key of cartKeys) {
            await this.redisClientService.del(key);
        }

        for (const product of products) {
            const { id } = product;

            await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));
        }

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = ProductResetController;
