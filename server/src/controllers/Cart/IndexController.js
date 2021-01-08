class CartIndexController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;
        let productList = [];

        const cartList = await this.redisClientService.hgetall(`cart:${cartId}`);

        if (!cartList) {
            return res.send(productList);
        }

        for (const itemKey of Object.keys(cartList)) {
            const product = await this.redisClientService.jsonGet(itemKey);

            productList.push({ product: JSON.parse(product), quantity: cartList[itemKey] });
        }

        return res.send(productList);
    }
}

module.exports = CartIndexController;
