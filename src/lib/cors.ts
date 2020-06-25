'use strict';

import { KeyValue } from '../lib/interface';
import { compareStr, send403 } from '../helper/helper';
import { FORBIDDEN_REQUEST } from '../config/constant';
import { Request, Response, NextFunction } from 'express';

export default (config: KeyValue = {}) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const reqOrigin: string = req.headers.origin || '';
        const corsOrigin: string[] = config.origins || [];
        const isOriginAllowed = reqOrigin && corsOrigin.some(e => {
            return reqOrigin.match(e);
        }) || false;

        const corsHosts: string[] = config.hosts || [];
        const isHostsAllowed = corsHosts.some(e => {
            return req.hostname.match(e);
        });

        res.header("Access-Control-Allow-Origin", isOriginAllowed || isHostsAllowed ? reqOrigin : corsOrigin);
        res.header('Access-Control-Allow-Credentials', config.allow_credentials);

        res.header('Access-Control-Allow-Methods', config.methods);
        res.header("Access-Control-Allow-Headers", config.headers);

        if (!isOriginAllowed && !isHostsAllowed) {
            const cError = new Error('Invalid domain');

            console.log(`host: ${req.hostname} -- origin: ${reqOrigin}`);
            return send403(res, cError, FORBIDDEN_REQUEST);
        }

        const isOptions = compareStr(req.method, 'OPTIONS');
        if (isOptions) return res.send();

        next();
    };
};