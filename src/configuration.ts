import { Field } from './fields/model';

export interface Configuration<F extends { [Key in keyof F]: F[Key] }> {
    fields: { [Key in keyof F]: Field<F[Key]> };
    data: { [Key in keyof F]: F[Key] }[];
}

export class ConfigurationBuilder<F extends { [Key in keyof F]: F[Key] } = { [Key in keyof F]: F[Key] }> {
    data: { [Key in keyof F]: F[Key] }[];
    fields: { [Key in keyof F]: Field<F[Key]> };

    constructor(data: { [Key in keyof F]: F[Key] }[], fields: { [Key in keyof F]: Field<F[Key]> }) {
        this.data = data;
        this.fields = fields;
    }

    withData(data: { [Key in keyof F]: F[Key] }[]) {
        this.data = data;
    }

    withFields(fields: { [Key in keyof F]: Field<F[Key]> }) {
        this.fields = fields;
    }

    build(): Configuration<F> {
        return {
            data: this.data,
            fields: this.fields
        };
    }
}
