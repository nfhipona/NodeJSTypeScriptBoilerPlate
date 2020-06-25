'use strict';

import { KeyValue } from '../lib/interface';
import e from 'express';

/** ENV PARSER */

const parseEnvConfig = (settingsStr: string): KeyValue => {

    let settings: KeyValue = {};

    if (!settingsStr) return settings;

    const settingsComponent = settingsStr.split('&');
    for (const component of settingsComponent) {
        const subComponents: string[] = component.split('::');
        const key: string = subComponents[0];
        const value: string = subComponents[1] || '';

        if (value.includes(',')) {
            let arrayValues: string[] = [];
            const arrayComponents: string[] = value.split(',');

            for (const val of arrayComponents) {
                const valTmp = isBoolean(val) ? boolValue(val) : isNanConvert(val);
                arrayValues.push(valTmp);
            }

            settings[key] = arrayValues;
        }else{
            settings[key] = isBoolean(value) ? boolValue(value) : isNanConvert(value);
        }
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

/** GENERATORS */

const randString = (length: number): string => {

	let randString: string = "";
	let possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

	for (let i = 0; i < length; i++) {
		randString += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return randString;
}

const randChar = (length: number): string => {

	let randChar: string = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	for (let i = 0; i < length; i++) {
		randChar += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return randChar;
}

const randNumber = (length: number): string => {

	let randNumber: string = "";
	let possible = "0123456789";

	for (let i = 0; i < length; i++) {
		randNumber += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return randNumber;
}

export {
    parseEnvConfig,
    isBoolean,
    boolValue,
    isNanConvert,
    combineObject,
    
    randString,
    randChar,
    randNumber
}