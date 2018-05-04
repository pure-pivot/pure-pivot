import * as React from 'react';
import { Fields } from './model';
import { FieldBooleanSelectionComponentProps, FormatBoolean } from './selection/field-boolean-component';
import { FieldNumberSelectionComponentProps, FormatNumber } from './selection/field-number-component';
import { FieldStringSelectionComponentProps, FormatString } from './selection/field-string-component';

export interface FieldBoolean {
    type: 'boolean';
    format: FormatBoolean;
}

export interface FieldNumber {
    type: 'number';
    format: FormatNumber;
}

export interface FieldString {
    type: 'string';
    format: FormatString;
}

export interface FieldOther {
    type: 'other';
    format: 'empty';
}

export type Field = FieldBoolean | FieldNumber | FieldString | FieldOther;

export interface FieldComponentProps {
    name: string;
    field: Field;
    fieldNumberSelectionComponent: React.ComponentType<FieldNumberSelectionComponentProps>;
    fieldStringSelectionComponent: React.ComponentType<FieldStringSelectionComponentProps>;
    fieldBooleanSelectionComponent: React.ComponentType<FieldBooleanSelectionComponentProps>;
    onFieldChange?: (field: Field) => void;
}

export class FieldComponent<T> extends React.Component<FieldComponentProps, never> {
    handleFieldChange(field: Field) {
        if (this.props.onFieldChange) {
            this.props.onFieldChange(field);
        }
    }

    renderSelectionComponent() {
        switch (this.props.field.type) {
            case 'number':
                return <this.props.fieldNumberSelectionComponent
                    format={this.props.field.format}
                    onChangeFormat={(format) => this.handleFieldChange({ type: this.props.field.type, format })}
                />;
            case 'string':
                return <this.props.fieldStringSelectionComponent format={this.props.field.format} />;
            case 'boolean':
                return <this.props.fieldBooleanSelectionComponent format={this.props.field.format} />;
            default:
                return null;
        }
    }

    render() {
        return <li>
            {this.props.name}
            ({this.props.field.type})
            {this.renderSelectionComponent()}
        </li>;
    }
}
