import * as React from 'react';
import { Field, Fields } from './fields/model';
import { FieldsComponentProps, FieldsComponent } from './fields/fields-component';
import { FieldComponentProps, FieldComponent } from './fields/field-component';
import { inferFields } from './fields/infer-fields';
import { FieldNumberSelectionComponent } from './fields/selection/field-number-component';
import { FieldStringSelectionComponent } from './fields/selection/field-string-component';
import { FieldBooleanSelectionComponent } from './fields/selection/field-boolean-component';
import { FieldSelectionComponentProps, FieldSelectionComponent } from './fields/selection/field-selection-component';

export interface Configuration<D> {
    fields: Fields<D>;
    data: D[];
    fieldsComponent: React.ComponentType<Pick<FieldsComponentProps<D>, Exclude<keyof FieldsComponentProps<D>, 'fieldComponent'>>>;
}

export function providePropsComponentFactory<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>> {
    return (props: Pick<P, Exclude<keyof P, keyof U>>) => <Component {...providedProps} {...props} />;
}

export class ConfigurationBuilder<D> {
    private data: D[];
    private fields: Fields<D>;
    private fieldSelectionComponent: React.ComponentType<FieldSelectionComponentProps<D[keyof D]>>;
    private fieldComponent: React.ComponentType<FieldComponentProps<D[keyof D]>>;
    private fieldsComponent: React.ComponentType<FieldsComponentProps<D>>;

    constructor(data: { [Key in keyof D]: D[Key] }[]) {
        this.data = data;
        this.fields = inferFields(data);
        this.fieldSelectionComponent = FieldSelectionComponent;
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

    withFieldFormat<F extends keyof D>(name: F, format: Field<D[F]>['format']) {
        this.fields[name].format = format;
        return this;
    }

    withFields(fields: { [Key in keyof D]: Field<D[Key]> }) {
        this.fields = fields;
        return this;
    }

    withFieldSelectionComponent(fieldSelectionComponent: React.ComponentType<FieldSelectionComponentProps<D[keyof D]>>) {
        this.fieldSelectionComponent = fieldSelectionComponent;
        return this;
    }

    withFieldComponent(fieldComponent: React.ComponentType<FieldComponentProps<D[keyof D]>>) {
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
            fieldsComponent: providePropsComponentFactory(this.fieldsComponent, {
                fieldComponent: providePropsComponentFactory(this.fieldComponent, {
                    fieldSelectionComponent: providePropsComponentFactory(this.fieldSelectionComponent, {
                        fieldNumberSelectionComponent: FieldNumberSelectionComponent,
                        fieldStringSelectionComponent: FieldStringSelectionComponent,
                        fieldBooleanSelectionComponent: FieldBooleanSelectionComponent
                    })
                })
            })
        };
    }
}
