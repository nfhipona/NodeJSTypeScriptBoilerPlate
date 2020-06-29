'use strict';

/** Object Interface */
export class KeyValue implements Object { [key: string]: any; };

/** Props */
export class Prop {

    propKey: string; /// prop key
    sourceKey: string; /// original key
    struct: any;
    type: string; /// prop value type
    isOptional: boolean; /// is optional if has '_' prefix 

    constructor(key: string, value: any) {
        
        this.isOptional = key[0] === '_';
        this.propKey = this.isOptional ? key.slice(1) : key;
        this.sourceKey = key;
        this.struct = value;
        this.type = typeof value;
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
}

export class FormData {

    source: any;
    structure: any;
    func: Function;

    constructor(func: Function) {

        this.func = func;
    }

    set_struct(struct: any) {

        this.structure = struct;

        return this;
    }

    set_source(src: any) {

        this.source = src;

        return this;
    }

    parse(strict: boolean = true): any {

        if (!this.source || !this.structure) return new Error('Invalid data');

        return this.func(this.structure, this.source, '', strict);
    }
}