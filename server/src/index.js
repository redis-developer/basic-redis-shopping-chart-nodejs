const express = require('express');
const redis = require('redis');
const rejson = require('redis-rejson');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const RedisClient = require('./services/RedisClient');

rejson(redis);

require('dotenv').config();

const { REDIS_ENDPOINT_URI, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, PORT } = process.env;

const app = express();

app.use(
    cors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true
    })
);

const redisEndpointUri = REDIS_ENDPOINT_URI
    ? REDIS_ENDPOINT_URI.replace(/^(redis\:\/\/)/, '')
    : `${REDIS_HOST}:${REDIS_PORT}`;

const redisClient = redis.createClient(`redis://${redisEndpointUri}`, {
    password: REDIS_PASSWORD
});

const redisClientService = new RedisClient(redisClient);

app.set('redisClientService', redisClientService);

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'someSecret',
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: 3600 * 1000 * 3
        }
    })
);

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../../client-dist')));

const router = require('./routes')(app);

app.use('/api', router);

const port = PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
