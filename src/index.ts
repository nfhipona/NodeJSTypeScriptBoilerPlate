'use strict';

import express from 'express';
import parser from 'body-parser';
import http from 'http';
import https from 'https';
import morgan from 'morgan';

import { send200 } from './helper/helper';
import { serverConfig, certificate } from './config/config'

const pjson = require('../package.json');

function appServer(): express.Application {

    const serverConf = serverConfig;
    const cert = certificate;
    const hasSSLCert = cert.key && cert.cert;

    const app: express.Application = express();
    const server = hasSSLCert ? new https.Server(cert, app) : new http.Server(app);

    app.use(parser.json());
    app.use(parser.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // add routers

    /**
     * @api {get} / Server information
     * @apiName GetServerInfo
     * @apiGroup Server
     */
    app.get('/', (req, res) => {

        const info = {
            version: pjson.version,
            docs: 'https://documenter.getpostman.com/view/docs'
        };

        send200(res, info, 'Welcome to boilerplate API');
    });

    // handles unknown routes
    app.all('*', (req, res, next) => {

        if (req.method !== 'OPTIONS') {
            send200(res, {}, 'Nothing to do here.');
        }

        next();
    });

    server.listen(serverConf.port, () => {
        console.log(`
            Listening on port: ${serverConf.port}
            Running on ${hasSSLCert ? 'https' : 'http'} connection
            App Version: ${pjson.version}\n`
        );
    });

    return app;
};

export default appServer();