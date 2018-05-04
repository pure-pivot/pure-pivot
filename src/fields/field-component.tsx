import * as React from 'react';
import { Field, Fields } from './model';
import { FieldNumberSelectionComponentProps } from './selection/field-number-component';
import { FieldStringSelectionComponentProps } from './selection/field-string-component';
import { FieldBooleanSelectionComponentProps } from './selection/field-boolean-component';

export interface FieldComponentProps<T> {
    name: string;
    field: Field<T>;
    fieldNumberSelectionComponent: React.ComponentType<FieldNumberSelectionComponentProps>;
    fieldStringSelectionComponent: React.ComponentType<FieldStringSelectionComponentProps>;
    fieldBooleanSelectionComponent: React.ComponentType<FieldBooleanSelectionComponentProps>;
    onFieldChange?: (field: Field<T>) => void;
}

export class FieldComponent<T> extends React.Component<FieldComponentProps<T>, never> {
    handleFormatChange(format: Field<T>['format']) {
        if (this.props.onFieldChange) {
            this.props.onFieldChange({ type: this.props.field.type, format });
        }
    }

    renderSelectionComponent() {
        switch (this.props.field.type) {
            case 'number':
                return <this.props.fieldNumberSelectionComponent format={this.props.field.format} onChangeFormat={(format) => this.handleFormatChange(format)} />;
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
