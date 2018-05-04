import * as React from 'react';
import { Field, Fields } from './fields/model';
import { FieldsComponentProps, FieldsComponent } from './fields/fields-component';
import { FieldComponentProps, FieldComponent } from './fields/field-component';
import { inferFields } from './fields/infer-fields';

export interface Configuration<D extends { [Key in keyof D]: D[Key] }> {
    fields: { [Key in keyof D]: Field<D[Key]> };
    data: { [Key in keyof D]: D[Key] }[];
    fieldComponent: React.ComponentType<FieldComponentProps<D>>;
    fieldsComponent: React.ComponentType<{}>;
}

export function providePropsComponentFactory<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>> {
    return (props: Pick<P, Exclude<keyof P, keyof U>>) => <Component {...providedProps} {...props} />;
}

export class ConfigurationBuilder<D extends { [Key in keyof D]: D[Key] } = { [Key in keyof D]: D[Key] }> {
    private data: D[];
    private fields: { [Key in keyof D]: Field<D[Key]> };
    private fieldComponent: React.ComponentType<FieldComponentProps<D>>;
    private fieldsComponent: React.ComponentType<FieldsComponentProps<D>>;

    constructor(data: { [Key in keyof D]: D[Key] }[]) {
        this.data = data;
        this.fields = inferFields(data);
        this.fieldComponent = FieldComponent;
        this.fieldsComponent = FieldsComponent;
    }

    withData(data: D[]) {
        this.data = data;
        return this;
    }

    withField<F extends keyof D>(name: F, field: Fields<D>[F]) {
        this.fields[name] = field;
        return this;
    }

    withFieldFormat<F extends keyof D>(name: F, format: Fields<D>[F]['format']) {
        this.fields[name].format = format;
        return this;
    }

    withFields(fields: { [Key in keyof D]: Field<D[Key]> }) {
        this.fields = fields;
        return this;
    }

    withFieldComponent(fieldComponent: React.ComponentType<FieldComponentProps<D>>) {
        this.fieldComponent = fieldComponent;
        return this;
    }

    withFieldsComponent(fieldsComponent: React.ComponentType<FieldsComponentProps<D>>) {
        this.fieldsComponent = fieldsComponent;
        return this;
    }

    build(): Configuration<D> {
        return {
            data: this.data,
            fields: this.fields,
            fieldComponent: this.fieldComponent,
            fieldsComponent: providePropsComponentFactory(this.fieldsComponent, { fields: this.fields, fieldComponent: this.fieldComponent })
        };
    }
}
