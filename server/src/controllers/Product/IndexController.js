const { products } = require('../../products.json');

class ProductIndexController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const productKeys = await this.redisClientService.scan('product:*');
        const productList = [];

        if (productKeys.length) {
            for (const key of productKeys) {
                const product = await this.redisClientService.jsonGet(key);

                productList.push(JSON.parse(product));
            }

            return res.send(productList);
        }

        for (const product of products) {
            const { id } = product;

            await this.redisClientService.jsonSet(`product:${id}`, '.', JSON.stringify(product));

            productList.push(product);
        }

        return res.send(productList);
    }
}

module.exports = ProductIndexController;
