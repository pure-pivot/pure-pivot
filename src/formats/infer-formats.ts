import { Formats, Format, AnyFormat } from './model';
import { ObjectKeys } from '../util/keys';
import { Fields } from '../fields/model';

export function inferFormats<D>(fields: Fields<D>): Formats<D> {
    const formats: Formats<D> = {} as Formats<D>;

    for (const key of ObjectKeys(fields)) {
        switch (fields[key]) {
            case 'boolean':
                formats[key] = 'yes-no' as Format<D[keyof D]>;
                break;
            case 'number':
                formats[key] = 'number' as Format<D[keyof D]>;
                break;
            case 'string':
                formats[key] = 'text' as Format<D[keyof D]>;
                break;
            case 'other':
                formats[key] = 'empty' as Format<D[keyof D]>;
                break;
        }
    }

    return formats;
}
