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

const {
    NODE_ENV,
    REDIS_ENDPOINT_URI,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    PORT,
    SESSION_SECRET,
    APP_FRONTEND_URL
} = process.env;

const app = express();

if (NODE_ENV !== 'production') {
    app.use(
        cors({
            origin(origin, callback) {
                if (origin === APP_FRONTEND_URL) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true
        })
    );
}

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
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
            maxAge: 3600 * 1000 * 3
        }
    })
);

app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, './public')));

const router = require('./routes')(app);

app.use('/api', router);

const port = PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
