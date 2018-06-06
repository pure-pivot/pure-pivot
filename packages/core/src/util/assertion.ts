export function isNumber(object: any): object is number {
    return typeof object === 'number';
}

export function isBoolean(object: any): object is boolean {
    return typeof object === 'boolean';
}

export function isString(object: any): object is string {
    return typeof object === 'string';
}

export function isArrayOf<T>(object: any, predicate: (object: any) => object is T): object is T[] {
    return Array.isArray(object) && object.every((item) => predicate(item));
}

export function assertOrThrow<T>(object: any, assertion: (object: any) => object is T): T {
    if (assertion(object)) {
        return object;
    } else {
        throw new Error('Type assertion failed.');
    }
}
