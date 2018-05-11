import * as React from 'react';
import { Field } from './model';

export interface FieldComponentProps<T> {
    name: string;
    field: Field<T>;
}

export class FieldComponent<T> extends React.Component<FieldComponentProps<T>, never> {
    render() {
        return <li>
            {this.props.name}
            ({this.props.field})
        </li>;
    }
}
