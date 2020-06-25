'use strict';

import redis from 'redis';
import { redisConfig } from '../config/config';

const client: redis.RedisClient = redis.createClient();
redis.createClient({ port: redisConfig.port, host: redisConfig.host, password: redisConfig.password });

client.on('connect', error => {
    console.error(`redis is connected`);
});

client.on('ready', error => {
    console.error(`redis is ready`);
});

client.on('error', error => {
  console.error(`redis error: `, error);
});

export default client;