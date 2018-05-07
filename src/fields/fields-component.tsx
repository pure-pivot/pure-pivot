import * as React from 'react';
import { Fields, Field } from './model';
import { ObjectKeys } from '../util/keys';
import { FieldComponentProps } from './field-component';

export interface FieldsComponentProps<D> {
    fields: Fields<D>;
    fieldComponent: React.ComponentType<Pick<FieldComponentProps<D[keyof D]>, Exclude<keyof FieldComponentProps<D[keyof D]>, 'fieldSelectionComponent'>>>;
    onFieldsChange: (fields: Fields<D>) => void;
}

export class FieldsComponent<D> extends React.Component<FieldsComponentProps<D>, never> {
    handleFieldChange(key: keyof D, field: Field<D[keyof D]>) {
        const fields = Object.assign({}, this.props.fields);
        fields[key] = field;
        this.props.onFieldsChange(fields);
    }

    render() {
        return <ul>
            {ObjectKeys(this.props.fields).map((key) =>
                <this.props.fieldComponent key={key} name={key} field={this.props.fields[key]} onFieldChange={(field) => this.handleFieldChange(key, field)} />
            )}
        </ul>;
    }
}
