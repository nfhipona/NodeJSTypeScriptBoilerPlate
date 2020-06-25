'use strict';

import { Response, NextFunction } from 'express';
import { KeyValue } from '../lib/interface';

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

const compareStr = (str1: string, str2: string) => {

    return str1.toLowerCase() === str2.toLowerCase();
}

/** RESPONSE HANDLER */

const send200 = (res: Response, data: any, message: string) => {
    
    const responseData = constructSuccessData(message, data);

	sendResponse(res, 200, responseData);
}

const send400 = (res: Response, err: Error, message: string) => {
    
    const error_data = checkError(err);
    const responseData = constructErrorData(message, error_data);

	sendResponse(res, 400, responseData);
}

const send401 = (res: Response, err: Error, message: string) => {

    const error_data = checkError(err);
    const responseData = constructErrorData(message, error_data);

	sendResponse(res, 401, responseData);
}

const send403 = (res: Response, err: Error, message: string) => {

    const error_data = checkError(err);
    const responseData = constructErrorData(message, error_data);

	sendResponse(res, 403, responseData);
}

const send404 = (res: Response, err: Error, message: string) => {

    const error_data = checkError(err);
    const responseData = constructErrorData(message, error_data);

	sendResponse(res, 404, responseData);
}

const send500 = (res: Response, err: Error, message: string) => {

    const error_data = checkError(err);
    const responseData = constructErrorData(message, error_data);

	sendResponse(res, 500, responseData);
}

const send503 = (res: Response, err: Error, message: string) => {

    const error_data = checkError(err);
    const responseData = constructErrorData(message, error_data);

	sendResponse(res, 503, responseData);
}

const constructErrorData = (context: string, data: any) => {
    if (!data && context) console.log(`Error message: `, context);

    return responseData(false, context, data);
};

const constructSuccessData = (context: string, data: any) => {

    return responseData(true, context, data);
}

const responseData = (success: boolean, context: string, data: any) => {

    const response_data = {
        success: success,
        message: context,
        data: data
    };

    return response_data;
}

const sendResponse = (res: Response, code: number, data: any) => {

    res
        .status(code)
        .send(data);
}

/** ERROR HANDLER */

const checkError = (err: any) => {
    console.log('\nError: ', err);

    if (err && err.code) {
        const code = err.code.toString();

        if (code === 'ER_BAD_FIELD_ERROR' ||
            code === 'ER_WRONG_VALUE_COUNT_ON_ROW' ||
            code === 'ER_NO_SUCH_TABLE' ||
            code === 'ER_WRONG_TABLE_NAME' ||
            code === 'ER_ACCESS_DENIED_ERROR' ||
            code === 'ER_NO_REFERENCED_ROW_2' ||
            code === 'ER_DATA_TOO_LONG') {

            return { message: 'Bad parameters.' };

        } else if (code === 'ER_DUP_ENTRY') {
            return { message: 'Duplicate entry' }; // err.sqlMessae

        } else if (code === 'ECONNREFUSED') {
            return { message: 'Server connection error.' };

        } else if (code === 'ER_PARSE_ERROR' ||
            code === 'ER_WRONG_NUMBER_OF_COLUMNS_IN_SELECT' ||
            code === 'ER_NON_UNIQ_ERROR' ||
            code === 'ER_LOCK_WAIT_TIMEOUT' ||
            code === 'PROTOCOL_SEQUENCE_TIMEOUT') {

            return { message: 'Server error.' };
        } else if (err.sql) {
            return { message: 'Server error.' };
        }
    }

    return err;
};


export {
    parseEnvConfig,
    isBoolean,
    boolValue,
    isNanConvert,
    combineObject,
    
    randString,
    randChar,
    randNumber,

    compareStr,

    send200,
    send400,
    send401,
    send403,
    send404,
    send500,
    send503
}