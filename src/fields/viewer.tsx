import * as React from 'react';
import { Fields } from './model';
import { ObjectKeys } from '../util/keys';

export interface FieldsViewerProps<D extends { [Key in keyof D]: D[Key] }> {
    fields: Fields<D>;
}

export class FieldsViewer<D extends { [Key in keyof D]: D[Key] }> extends React.Component<FieldsViewerProps<D>, never> {
    render() {
        return <ul>
            {ObjectKeys(this.props.fields).map((key) =>
                <li key={key}>{key} ({this.props.fields[key].type})</li>
            )}
        </ul>;
    }
}
