import * as React from 'react';
import { OtherValue } from '../model';

export interface OtherValueComponentProps<T> {
    value: OtherValue<T>;
}

export class OtherValueComponent<T> extends React.Component<OtherValueComponentProps<T>, never> {
    render() {
        return <React.Fragment>
            other value: {this.props.value.type}
        </React.Fragment>;
    }
}
