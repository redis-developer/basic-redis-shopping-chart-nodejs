const express = require('express');
const router = express.Router();
const checkSession = require('../middleware/checkSession');
const IndexController = require('../controllers/Cart/IndexController');
const UpdateController = require('../controllers/Cart/UpdateController');
const DeleteItemController = require('../controllers/Cart/DeleteItemController');
const EmptyController = require('../controllers/Cart/EmptyController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const indexController = new IndexController(redisClientService);
    const updateController = new UpdateController(redisClientService);
    const deleteItemController = new DeleteItemController(redisClientService);
    const emptyController = new EmptyController(redisClientService);

    router.get('/', [checkSession], (...args) => indexController.index(...args));
    router.put('/:id', [checkSession], (...args) => updateController.index(...args));
    router.delete('/:id', [checkSession], (...args) => deleteItemController.index(...args));
    router.delete('/', [checkSession], (...args) => emptyController.index(...args));

    return router;
};
