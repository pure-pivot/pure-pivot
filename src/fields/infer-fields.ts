import { Fields, Field, AnyField } from './model';
import { ObjectKeys } from '../util/keys';

export function inferFields<D>(data: D[]): Fields<D> {
    const fields: Fields<D> = {} as Fields<D>;
    const anyField: AnyField = { type: 'other', format: 'empty' };
    for (const row of data) {
        for (const key of ObjectKeys(row)) {
            let field: Field<any>;
            if (typeof row[key] === 'string') {
                field = { type: 'string', format: 'text' };
            } else if (typeof row[key] === 'number') {
                field = { type: 'number', format: 'number' };
            } else if (typeof row[key] === 'boolean') {
                field = { type: 'boolean', format: 'yes-no' };
            } else {
                field = anyField;
            }

            if (fields[key] && fields[key].type !== field.type) {
                fields[key] = anyField as Field<D[keyof D]>;
            } else {
                fields[key] = field as Field<D[keyof D]>;
            }
        }
    }
    return fields;
}
