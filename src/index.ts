'use strict';

import express = require('express');
import parser = require('body-parser');
import http = require('http');
import https = require('https');

import config from './config/config'

const pjson = require('../package.json');

function appServer(): express.Application {

    const serverConf = config.serverConfig;
    const cert = config.certificate;
    const hasSSLCert = cert.key && cert.cert;

    const app: express.Application = express();
    const server = hasSSLCert ? new https.Server(cert, app) : new http.Server(app);

    app.use(parser.json());
    app.use(parser.urlencoded({ extended: true }));

    // add routers

    // handles unknown routes
    app.all('*', (req, res, next) => {

        if (req.method !== 'OPTIONS') {
            res
                .status(404)
                .send({ message: 'Nothing to do here.' });
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