import { ObjectKeys } from '../util/keys';
import { ValueReducers } from './model';
import { isArrayOf, isBoolean } from '../util/assertion';

export function defaultValueReducer<T>(values: T[]): T {
    if (values.length >= 1) {
        if (isArrayOf(values, isBoolean)) {

        }
    } else {
        throw new Error('Default value reducer cannot handle empty arrays.');
    }
}

export function inferValues<D>(): ValueReducers<D> {
    const values: Values<D> = [];

    let counter = 0;
    for (const key of ObjectKeys(fields)) {
        values.push({
            id: (counter++).toString(),
            name: key,
            value: { type: 'count' }
        });
    }

    return values;
}
