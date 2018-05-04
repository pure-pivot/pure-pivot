import * as React from 'react';
import { Field, Fields } from './model';

export interface FieldComponentProps<D extends { [Key in keyof D]: D[Key] }, F extends keyof D> {
    name: F;
    field: Fields<D>[F];
    onFieldChange?: (name: F, field: Fields<D>[F]) => void;
}

export class FieldComponent<D extends { [Key in keyof D]: D[Key] }, F extends keyof D> extends React.Component<FieldComponentProps<D, F>, never> {
    render() {
        return <li>{this.props.name} ({this.props.field.type})</li>;
    }
}
