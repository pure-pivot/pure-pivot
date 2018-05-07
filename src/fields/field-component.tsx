import * as React from 'react';
import { Field } from './model';
import { FieldSelectionComponentProps } from './selection/field-selection-component';

export interface FieldComponentProps<T> {
    name: string;
    field: Field<T>;
    fieldSelectionComponent: React.ComponentType<Pick<FieldSelectionComponentProps<T>, Exclude<keyof FieldSelectionComponentProps<T>, 'fieldNumberSelectionComponent' | 'fieldStringSelectionComponent' | 'fieldBooleanSelectionComponent'>>>;
    onFieldChange: (field: Field<T>) => void;
}

export class FieldComponent<T> extends React.Component<FieldComponentProps<T>, never> {
    handleFieldChange(field: Field<T>) {
        this.props.onFieldChange(field);
    }

    render() {
        return <li>
            <label>
                {this.props.name}
                ({this.props.field.type})
                <this.props.fieldSelectionComponent field={this.props.field} onFieldChange={(field) => this.handleFieldChange(field)} />
            </label>
        </li>;
    }
}
