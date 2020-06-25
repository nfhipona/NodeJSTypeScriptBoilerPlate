'use strict';

import { KeyValue } from '../lib/interface';

/** ENV PARSER */

const parseEnvConfig = (settingsStr: string): KeyValue => {

    let settings: KeyValue = {};

    if (!settingsStr) return settings;

    const settingsComponent = settingsStr.split('&');
    for (const component of settingsComponent) {
        const subComponents: string[] = component.split('::');
        const key: string = subComponents[0];
        const value: string = subComponents[1];

        settings[key] = isBoolean(value) ? boolValue(value) : isNanConvert(value);
    }

    return settings;
}

const isBoolean = (value: string): boolean => {

    return value === 'false' || value === 'true';
}

const boolValue = (value: string): boolean => {

    return value === 'false' ? false : true;
}

const isNanConvert = (value: string): any => {

    if (value.length === 0) return value;
    
    const tmp = Number(value);
    return isNaN(tmp) ? value : tmp;
}

const combineObject = (object: KeyValue, toObject: KeyValue): KeyValue => {

    for (const key in object) {
        toObject[key] = object[key];
    }

    return toObject;
}

export {
    parseEnvConfig,
    isBoolean,
    boolValue,
    isNanConvert,
    combineObject
}