const { StatusCodes } = require('http-status-codes');

class DeleteCartItemController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;
        const { id: productId } = req.params;

        const quantityInCart = await this.redisClientService.redis.hget(`cart:${cartId}`, `product:${productId}`);

        if (quantityInCart >= 0) {
            await this.redisClientService.redis.hdel(`cart:${cartId}`, `product:${productId}`);

            let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += quantityInCart;

            await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        }

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = DeleteCartItemController;
