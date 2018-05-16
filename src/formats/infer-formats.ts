import { Formats, FormattedData } from './model';
import { ObjectKeys } from '../util/keys';

export function defaultValueFormatter(value: any): string {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    } else if (typeof value === 'number') {
        return value.toString();
    } else if (typeof value === 'string') {
        return value;
    } else {
        return '';
    }
}

export function defaultRowFormatter<D>(row: D): FormattedData<D> {
    const result = {} as FormattedData<D>;
    for (const key of ObjectKeys(row)) {
        result[key] = defaultValueFormatter(row[key]);
    }
    return result;
}

export function defaultGroupFormatter<D>(data: D[]): FormattedData<D> {
    const flatValues = {} as { [Key in keyof D]: D[Key][] };
    for (const row of data) {
        for (const key of ObjectKeys(row)) {
            if (!flatValues[key]) {
                flatValues[key] = [];
            }
            flatValues[key].push(row[key]);
        }
    }

    const result = {} as FormattedData<D>;
    for (const key of ObjectKeys(flatValues)) {
        result[key] = flatValues[key].join(', ');
    }

    return result;
}

export function inferFormats(): Formats<any> {
    return {
        valueFormatter: defaultRowFormatter,
        groupFormatter: defaultGroupFormatter
    };
}
