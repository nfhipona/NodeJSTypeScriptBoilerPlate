'use strict';

import { KeyValue, Prop, FormData } from './interface';

/**
 * 
 * @param struct data structure
 * @param source data source
 * @param ref reference key
 * @param strict strict only load data from structure
 */
const squash = (struct: any, source: any, ref: string = '', strict: boolean = true): any => {

    // check for source type
    if (typeof struct !== typeof source || Array.isArray(struct) !== Array.isArray(source)) {
        return new Error('Structure-Source type mismatch');
    }

    // check structure and if value has types
    if (Array.isArray(struct) && struct.length) {
        let temp: any[] = [];
        
        for (const i in source) {
            const ret = squash(struct[0], source[i], ref + `[${i}]`, strict);
            if (ret instanceof Error) return ret; // break loop
            temp.push(ret);
        }

        return temp;
    }

    if (typeof struct === 'object') {
        return check_primitive(struct, source, ref, strict);
    }

    if (typeof struct !== typeof source) return new Error(ref + ` invalid type`);

    return source;
}

/**
 * 
 * @param struct data structure
 * @param source data source
 * @param ref reference key
 */
const check_primitive = (struct: any, source: any, ref: string = '', strict: boolean = true): any => {

    let squashed: KeyValue = {};

    // check primitive data
    for (const key in struct) {
        if (struct.hasOwnProperty(key)) { // check for prototype keys
            
            // create struct prop
            const prop: Prop = new Prop(key, struct[key]);
            const refTmp = ref.length ? `${ref}.${prop.propKey}` : prop.propKey;
            const ret = primitive_data(prop, source, refTmp, strict);

            if (ret instanceof Error) return ret;
            squashed[key] = ret;
        }
    }

    if (!strict) {
        // load unvalidated data from source
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (squashed[key]) continue; // skip
    
                // add unvalidated data to squashed data
                squashed[key] = source[key];
            }
        }
    }

    return squashed;
}

const primitive_data = (prop: Prop, source: any, ref: string = '', strict: boolean = true): any => {

    // mandatory prop
    if (!prop.isOptional) {
        const source_type = typeof source[prop.propKey];
        if (source_type === 'undefined') {
            return new Error(`${ref} is missing`);
        }
    }

    // string 
    if (prop.isString()) {
        const tmp = source[prop.propKey];
        return typeof tmp === 'string' ? tmp : new Error(ref + ` invalid type`);
    }

    // number
    if (prop.isNumber()) {
        const tmp = source[prop.propKey];
        return isNaN(tmp) ? new Error(ref + ` invalid type`) : Number(tmp);
    }

    // boolean
    if (prop.isBool()) {
        const tmp = source[prop.propKey];
        return Boolean(tmp);
    }

    // object
    if (prop.isObject()) {
        const tmp = source[prop.propKey];
        return typeof tmp === 'object' ? squash(prop.struct, tmp, ref, strict) : new Error(ref + ` invalid type`);
    }

    return new Error(ref + ` undefined data type`);
}

export default new FormData(squash);