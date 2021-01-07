const { StatusCodes } = require('http-status-codes');

class EmptyCartController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;

        const cartList = await this.redisClientService.redis.hgetall(`cart:${cartId}`);

        for (const key of Object.keys(cartList)) {
            await this.redisClientService.redis.hdel(`cart:${cartId}`, key);

            let productInStore = await this.redisClientService.jsonGet(key);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += cartList[key];

            await this.redisClientService.jsonSet(key, '.', JSON.stringify(productInStore));
        }

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = EmptyCartController;
