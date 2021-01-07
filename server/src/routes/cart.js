const express = require('express');
const router = express.Router();
const checkSession = require('../middleware/checkSession');
const IndexCartController = require('../controllers/Cart/IndexCartController');
const UpdateCartController = require('../controllers/Cart/UpdateCartController');
const DeleteCartItemController = require('../controllers/Cart/DeleteCartItemController');
const EmptyCartController = require('../controllers/Cart/EmptyCartController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const indexCartController = new IndexCartController(redisClientService);
    const updateCartController = new UpdateCartController(redisClientService);
    const deleteCartItemController = new DeleteCartItemController(redisClientService);
    const emptyCartController = new EmptyCartController(redisClientService);

    router.get('/', [checkSession], (...args) => indexCartController.index(...args));
    router.put('/:id', [checkSession], (...args) => updateCartController.index(...args));
    router.delete('/:id', [checkSession], (...args) => deleteCartItemController.index(...args));
    router.delete('/', [checkSession], (...args) => emptyCartController.index(...args));

    return router;
};
