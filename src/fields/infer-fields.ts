import { Fields, Field } from './model';
import { ObjectKeys } from '../util/keys';

export function inferFields<D extends { [Key in keyof D]: D[Key] }>(data: D[]): Fields<D> {
    const fields: Fields<D> = {} as Fields<D>;
    const anyField: Field<any> = { type: 'any', format: 'empty' };
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
                fields[key] = anyField;
            } else {
                fields[key] = field;
            }
        }
    }
    return fields;
}
