import { Fields, Field, AnyField } from './model';
import { ObjectKeys } from '../util/keys';

export function inferFields<D>(data: D[]): Fields<D> {
    const fields: Fields<D> = {} as Fields<D>;
    for (const row of data) {
        for (const key of ObjectKeys(row)) {
            let field: Field<any>;
            if (typeof row[key] === 'string') {
                field = 'string';
            } else if (typeof row[key] === 'number') {
                field = 'number';
            } else if (typeof row[key] === 'boolean') {
                field = 'boolean';
            } else {
                field = 'other';
            }

            if (fields[key] && fields[key] !== field) {
                fields[key] = 'other' as Field<D[keyof D]>;
            } else {
                fields[key] = field as Field<D[keyof D]>;
            }
        }
    }
    return fields;
}
