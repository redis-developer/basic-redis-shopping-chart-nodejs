const { promisify } = require('util');

class RedisClient {
    constructor(redisClient) {
        this.keyExpiresInMinutes = 0;
        this.redis = redisClient;
        ['json_get', 'json_set', 'hgetall', 'hset', 'hget', 'hdel', 'hincrby', 'scan'].forEach(
            method => (this.redis[method] = promisify(this.redis[method]))
        );
    }

    async eachScan(pattern) {
        let matchingKeysCount = 0;
        let keys = [];

        const recursiveScan = async (cursor = 0) => {
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
}

module.exports = RedisClient;
