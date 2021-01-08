const { promisify } = require('util');

class RedisClient {
    constructor(redisClient) {
        ['json_get', 'json_set', 'hgetall', 'hset', 'hget', 'hdel', 'hincrby', 'del', 'scan'].forEach(
            method => (redisClient[method] = promisify(redisClient[method]))
        );
        this.redis = redisClient;
    }

    async scan(pattern) {
        let matchingKeysCount = 0;
        let keys = [];

        const recursiveScan = async (cursor = '0') => {
            const [newCursor, matchingKeys] = await this.redis.scan(cursor, 'MATCH', pattern);
            cursor = newCursor;

            matchingKeysCount += matchingKeys.length;
            keys = keys.concat(matchingKeys);

            if (cursor === '0') {
                return keys;
            } else {
                return await recursiveScan(cursor);
            }
        };

        return await recursiveScan();
    }

    jsonGet(key) {
        return this.redis.json_get(key);
    }

    jsonSet(key, path, json) {
        return this.redis.json_set(key, path, json);
    }

    hgetall(key) {
        return this.redis.hgetall(key);
    }

    hset(hash, key, value) {
        return this.redis.hset(hash, key, value);
    }

    hget(hash, key) {
        return this.redis.hget(hash, key);
    }

    hdel(hash, key) {
        return this.redis.hdel(hash, key);
    }

    hincrby(hash, key, incr) {
        return this.redis.hincrby(hash, key, incr);
    }

    del(key) {
        return this.redis.del(key);
    }
}

module.exports = RedisClient;
