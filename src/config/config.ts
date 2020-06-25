'use strict';

                    require('dotenv').config();
const fs            = require('fs');
const path          = require('path');

import { KeyValue } from '../lib/interface';
import { parseEnvConfig } from '../helper/helper';

const env = process.env;

const serverConfig: KeyValue        = parseEnvConfig(env.SERVER_CONFIG || '');
const jwtConfig: KeyValue           = parseEnvConfig(env.JWT_CONFIG || '');
const socketConfig: KeyValue        = parseEnvConfig(env.SOCKET_CONFIG || '');
const redisConfig: KeyValue         = parseEnvConfig(env.REDIS || '');

const mailAuth: KeyValue            = parseEnvConfig(env.MAIL_AUTH || '');
const mailConfig: KeyValue          = parseEnvConfig(env.MAIL_CONFIG || '');

const development: KeyValue         = parseEnvConfig(env.DEVELOPMENT_ENV || '');
const staging: KeyValue             = parseEnvConfig(env.STAGING_ENV || '');
const production: KeyValue          = parseEnvConfig(env.PRODUCTION_ENV || '');

const certConfig: KeyValue          = parseEnvConfig(env.SSL_CERTIFICATE || '');

/**
 * Configuration for handling redirects
 */
const envConfig: KeyValue = {
    development: development,
    staging: staging,
    production: production,
    use: (type: string) => {
        const current: string = env.NODE_ENV || 'development';
        const config = envConfig[current];
        return config[type];
    },
    test: (host: string = 'http://127.0.0.1', port: number = 7746) => {
        return `${host}:${port}`;
    }
}

const bcryptConfig: KeyValue = { rounds: 10 };

let key: any, cert: any;
try {
    fs.readFileSync(path.resolve(`${certConfig.path}/${certConfig.key}`));
} catch (err) {
    console.log(`\nServer SSL key not found: ${certConfig.key}`);
}
try {
    fs.readFileSync(path.resolve(`${certConfig.path}/${certConfig.cert}`));
} catch (err) {
    console.log(`\nServer SSL cert not found: ${certConfig.cert}`);
}

const certificate: KeyValue = (key && cert) ? { key, cert } : {};

export default {
    serverConfig,
    jwtConfig,
    socketConfig,
    redisConfig,

    mailAuth,
    mailConfig,

    envConfig,

    bcryptConfig,

    certificate
}