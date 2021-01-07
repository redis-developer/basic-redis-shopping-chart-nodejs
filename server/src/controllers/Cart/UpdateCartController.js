const { StatusCodes } = require('http-status-codes');

class UpdateCartController {
    constructor(redisClientService) {
        this.redisClientService = redisClientService;
    }

    async index(req, res) {
        const { cartId } = req.session;
        const { id: productId } = req.params;
        let { quantity, incrementBy } = req.body;

        quantity = parseInt(quantity);
        incrementBy = parseInt(incrementBy);

        let productInStore = await this.redisClientService.jsonGet(`product:${productId}`);

        if (!productInStore) {
            return res.status(StatusCodes.BAD_REQUEST).send("Product with this id doesn't exist");
        }

        if (quantity === 0) {
            return res.status.send('Selecting 0 is not possible');
        }

        let quantityInCart = (await this.redisClientService.redis.hget(`cart:${cartId}`, `product:${productId}`)) || 0;

        quantityInCart = parseInt(quantityInCart);

        productInStore = JSON.parse(productInStore);
        const { stock } = productInStore;

        if (quantity > 0) {
            const newStock = stock - (quantity - quantityInCart);

            if (newStock >= 0) {
                await this.redisClientService.redis.hset(`cart:${cartId}`, `product:${productId}`, quantity);

                productInStore.stock = newStock;

                await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));

                return res.sendStatus(StatusCodes.OK);
            }

            return res.status(StatusCodes.BAD_REQUEST).send('Not enough products in stock');
        } else if (quantity < 0) {
            return res.status(StatusCodes.BAD_REQUEST).send('Quantity should be greater than 0');
        }

        if (incrementBy !== 0) {
            const quantityAfterIncrement = quantityInCart + incrementBy;

            if (quantityAfterIncrement <= 0 || stock - incrementBy < 0) {
                return res.status(StatusCodes.BAD_REQUEST).send("Can't increment above stock or decrement to 0");
            }

            if (stock - incrementBy >= 0) {
                await this.redisClientService.redis.hincrby(`cart:${cartId}`, `product:${productId}`, incrementBy);

                productInStore.stock -= incrementBy;

                await this.redisClientService.jsonSet(`product:${productId}`, '.', JSON.stringify(productInStore));

                return res.sendStatus(StatusCodes.OK);
            }

            return res.status(StatusCodes.BAD_REQUEST).send('Not enough products in stock');
        } else if (incrementBy === 0) {
            return res.status(StatusCodes.BAD_REQUEST).send('Value of incrementBy should not be 0');
        }

        return res.status(StatusCodes.BAD_REQUEST).send('Please, provide quantity or incrementBy field');
    }
}

module.exports = UpdateCartController;
