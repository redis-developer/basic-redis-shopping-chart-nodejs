const fs = require('fs');
const express = require('express');
const router = express.Router();

module.exports = app => {
    fs.readdirSync(__dirname).forEach(function (route) {
        route = route.split('.')[0];

        if (route === 'index') {
            return;
        }

        router.use(`/${route}`, require(`./${route}`)(app));
    });

    return router;
};
