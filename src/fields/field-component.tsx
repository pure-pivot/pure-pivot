import * as React from 'react';
import { Field, Fields } from './model';

export interface FieldComponentProps<D extends { [Key in keyof D]: D[Key] }> {
    fieldName: keyof D;
    field: Fields<D>[keyof D];
}

export class FieldComponent<D extends { [Key in keyof D]: D[Key] }> extends React.Component<FieldComponentProps<D>, never> {
    render() {
        return <li>{this.props.fieldName} ({this.props.field.type})</li>;
    }
}
