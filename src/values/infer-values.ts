import { ObjectKeys } from '../util/keys';
import { ValueReducers } from './model';
import { isArrayOf, isBoolean } from '../util/assertion';

export function inferValues<D>(): ValueReducers<D> {
    return [{
        id: 'pure-pivot-default-count-reducer',
        label: 'Count',
        reducer: (values) => values.length.toString()
    }, {
        id: 'test',
        label: 'Just one',
        reducer: () => '1'
    }];
}
