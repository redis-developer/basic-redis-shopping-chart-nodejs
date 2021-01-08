const { StatusCodes } = require('http-status-codes');

class CartUpdateController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const {
            session: { cartId },
            params: { id: productId }
        } = req;

        let { quantity, incrementBy } = req.body;

        let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);

        if (!productInStore) {
            return res.status(StatusCodes.NOT_FOUND).send({ message: "Product with this id doesn't exist" });
        }

        let quantityInCart = (await this.redisClientService.hget(`cart:${cartId}`, `product:${productId}`)) || 0;

        quantityInCart = parseInt(quantityInCart);

        productInStore = JSON.parse(productInStore);
        const { stock } = productInStore;

        if (quantity) {
            quantity = parseInt(quantity);

            if (quantity <= 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Quantity should be greater than 0' });
            }

            const newStock = stock - (quantity - quantityInCart);

            if (newStock < 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Not enough products in stock' });
            }

            await this.redisClientService.hset(`cart:${cartId}`, `product:${productId}`, quantity);

            productInStore.stock = newStock;

            await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        }

        if (incrementBy) {
            incrementBy = parseInt(incrementBy);

            if (incrementBy !== 1 && incrementBy !== -1) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Value of incrementBy should be 1 or -1' });
            }

            const quantityAfterIncrement = quantityInCart + incrementBy;

            if (quantityAfterIncrement <= 0 || stock - incrementBy < 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: "Can't decrement stock to 0" });
            }

            if (stock - incrementBy < 0) {
                return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Not enough products in stock' });
            }

            await this.redisClientService.hincrby(`cart:${cartId}`, `product:${productId}`, incrementBy);

            productInStore.stock -= incrementBy;

            await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));
        }

        return res.sendStatus(StatusCodes.OK);
    }
}

module.exports = CartUpdateController;
