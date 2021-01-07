const express = require('express');
const router = express.Router();
const checkSession = require('../middleware/checkSession');
const IndexProductsController = require('../controllers/Products/IndexProductsController');

module.exports = app => {
    const redisClientService = app.get('redisClientService');

    const indexProductsController = new IndexProductsController(redisClientService);

    router.get('/', [checkSession], (...args) => indexProductsController.index(...args));

    return router;
};
