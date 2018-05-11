import * as React from 'react';
import { Fields } from './model';
import { ObjectKeys } from '../util/keys';
import { FieldComponentProps } from './field-component';

export interface FieldsComponentProps<D> {
    fields: Fields<D>;
    fieldComponent: React.ComponentType<FieldComponentProps<D[keyof D]>>;
}

export type FieldsComponentProvidedProps = 'fieldComponent';

export class FieldsComponent<D> extends React.Component<FieldsComponentProps<D>, never> {
    render() {
        return <ul>
            {ObjectKeys(this.props.fields).map((key) =>
                <this.props.fieldComponent key={key} name={key} field={this.props.fields[key]} />
            )}
        </ul>;
    }
}
