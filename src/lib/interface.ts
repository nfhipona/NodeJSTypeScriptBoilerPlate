'use strict';

/** Object Interface */
export class KeyValue implements Object { [key: string]: any; };

/** Props */
export class Prop {

    propKey: string; /// prop key
    sourceKey: string; /// original key
    type: string; /// prop value type
    isOptional: boolean; /// is optional if has '_' prefix 

    constructor(key: string, value: any) {
        
        this.isOptional = key[0] === '_';
        this.propKey = this.isOptional ? key.slice(1) : key;
        this.sourceKey = key;
        this.type = Array.isArray(value) ? 'array' : typeof value;
    }

    isString(): boolean {

        return this.type === 'string';
    }

    isNumber(): boolean {

        return this.type === 'number';
    }

    isBool(): boolean {
        
        return this.type === 'boolean';
    }

    isObject(): boolean {

        return this.type === 'object';
    }

    isArray(): boolean {

        return this.type === 'array';
    }
}