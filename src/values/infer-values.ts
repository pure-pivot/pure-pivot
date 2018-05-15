import { Value, Values, AnyValue } from './model';
import { ObjectKeys } from '../util/keys';
import { Fields } from '../fields/model';

export function inferValues<D>(fields: Fields<D>): Values<D> {
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
