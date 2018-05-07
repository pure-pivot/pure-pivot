import * as React from 'react';
import { Fields, Field, isFieldBoolean, isFieldNumber, isFieldString } from '../model';
import { FieldBooleanSelectionComponentProps } from './field-boolean-component';
import { FieldNumberSelectionComponentProps } from './field-number-component';
import { FieldStringSelectionComponentProps } from './field-string-component';

export interface FieldSelectionComponentProps<T> {
    field: Field<T>;
    fieldNumberSelectionComponent: React.ComponentType<FieldNumberSelectionComponentProps>;
    fieldStringSelectionComponent: React.ComponentType<FieldStringSelectionComponentProps>;
    fieldBooleanSelectionComponent: React.ComponentType<FieldBooleanSelectionComponentProps>;
    onFieldChange: (format: Field<T>) => void;
}

export class FieldSelectionComponent<T> extends React.Component<FieldSelectionComponentProps<T>, never> {
    handleFormatChange(format: Field<T>['format']) {
        this.props.onFieldChange(Object.assign({}, this.props.field, { format }));
    }

    render() {
        if (isFieldBoolean(this.props.field)) {
            return <this.props.fieldBooleanSelectionComponent
                format={this.props.field.format}
                onChangeFormat={(format) => this.handleFormatChange(format)}
            />;
        } else if (isFieldNumber(this.props.field)) {
            return <this.props.fieldNumberSelectionComponent
                format={this.props.field.format}
                onChangeFormat={(format) => this.handleFormatChange(format)}
            />;
        } else if (isFieldString(this.props.field)) {
            return <this.props.fieldStringSelectionComponent
                format={this.props.field.format}
                onChangeFormat={(format) => this.handleFormatChange(format)}
            />;
        } else {
            return null;
        }
    }
}
