import { Aggregate, Aggregates, AnyAggregate } from './model';
import { ObjectKeys } from '../util/keys';
import { Fields } from '../fields/model';

export function inferValues<D>(fields: Fields<D>): Aggregates<D> {
    const aggregates: Aggregates<D> = [];

    let counter = 0;
    for (const key of ObjectKeys(fields)) {
        aggregates.push({
            id: (counter++).toString(),
            name: key,
            aggregate: { type: 'count' }
        });
    }

    return aggregates;
}
