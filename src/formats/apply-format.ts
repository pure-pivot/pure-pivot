import { BooleanFormat, NumberFormat, StringFormat, OtherFormat, Format } from './model';
import { isBoolean, isNumber, isString } from '../util/assertion';

export function applyBooleanFormat(value: boolean, format: BooleanFormat): string {
    if (format === 'yes-no') {
        return value ? 'Yes' : 'No';
    } else {
        return format(value);
    }
}

export function applyNumberFormat(value: number, format: NumberFormat): string {
    if (format === 'number') {
        return value.toString();
    } else if (format === 'date') {
        return new Date(value).toDateString();
    } else if (format === 'time') {
        return new Date(value).toTimeString();
    } else if (format === 'date-time') {
        return new Date(value).toString();
    } else {
        return format(value);
    }
}

export function applyStringFormat(value: string, format: StringFormat): string {
    if (format === 'text') {
        return value;
    } else {
        return format(value);
    }
}

export function applyOtherFormat<T>(value: T, format: OtherFormat<T>): string {
    if (format === 'empty') {
        return '';
    } else {
        return format(value);
    }
}

export function applyFormat<T>(value: T, format: Format<T>): string {
    if (isBoolean(value)) {
        return applyBooleanFormat(value, format as BooleanFormat);
    } else if (isNumber(value)) {
        return applyNumberFormat(value, format as NumberFormat);
    } else if (isString(value)) {
        return applyStringFormat(value, format as StringFormat);
    } else {
        return applyOtherFormat(value, format as OtherFormat<T>);
    }
}
