const { StatusCodes } = require('http-status-codes');

class CartEmptyController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;

        const cartList = await this.redisClientService.hgetall(`cart:${cartId}`);

        if (!cartList) {
            return res.sendStatus(StatusCodes.NO_CONTENT);
        }

        for (const key of Object.keys(cartList)) {
            await this.redisClientService.hdel(`cart:${cartId}`, key);

            let productInStore = await this.redisClientService.jsonGet(key);

            productInStore = JSON.parse(productInStore);
            productInStore.stock += parseInt(cartList[key]);

            await this.redisClientService.jsonSet(key, '.', JSON.stringify(productInStore));
        }

        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

module.exports = CartEmptyController;
