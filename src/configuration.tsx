import * as React from 'react';
import { Field, Fields } from './fields/model';
import { ObjectKeys } from './util/keys';
import { FieldsComponentProps, FieldsComponent } from './fields/fields-component';
import { FieldComponentProps, FieldComponent } from './fields/field-component';

export interface Configuration<D extends { [Key in keyof D]: D[Key] }> {
    fields: { [Key in keyof D]: Field<D[Key]> };
    data: { [Key in keyof D]: D[Key] }[];
    fieldComponent: React.ComponentType<FieldComponentProps<D>>;
    fieldsComponent: React.ComponentType<Pick<FieldsComponentProps<D>, Exclude<keyof FieldsComponentProps<D>, 'fields' | 'fieldComponent'>>>;
}

export function fieldsComponentFactory<D extends { [Key in keyof D]: D[Key] }>(FieldsComponent: React.ComponentType<FieldsComponentProps<D>>, fields: Fields<D>, fieldComponent: React.ComponentType<FieldComponentProps<D>>): React.ComponentType<Pick<FieldsComponentProps<D>, Exclude<keyof FieldsComponentProps<D>, 'fields' | 'fieldComponent'>>> {
    return (props: Pick<FieldsComponentProps<D>, Exclude<keyof FieldsComponentProps<D>, 'fields' | 'fieldComponent'>>) => <FieldsComponent fields={fields} fieldComponent={fieldComponent} {...props} />;
}

export function inferFields<D extends { [Key in keyof D]: D[Key] }>(data: D[]): Fields<D> {
    const fields: Fields<D> = {} as Fields<D>;
    const anyField: Field<any> = { type: 'any', format: 'empty' };
    for (const row of data) {
        for (const key of ObjectKeys(row)) {
            let field: Field<any>;
            if (row[key] === undefined) {
                field = { type: 'undefined', format: 'undefined' };
            } else if (row[key] === null) {
                field = { type: 'null', format: 'null' };
            } else if (typeof row[key] === 'string') {
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

export class ConfigurationBuilder<D extends { [Key in keyof D]: D[Key] } = { [Key in keyof D]: D[Key] }> {
    data: D[];
    fields: { [Key in keyof D]: Field<D[Key]> };
    fieldComponent: React.ComponentType<FieldComponentProps<D>>;
    fieldsComponent: React.ComponentType<FieldsComponentProps<D>>;

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
            fieldsComponent: fieldsComponentFactory(this.fieldsComponent, this.fields, this.fieldComponent)
        };
    }
}
