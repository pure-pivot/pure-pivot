import * as React from 'react';
import { StringValue } from '../model';

export interface StringValueComponentProps {
    value: StringValue;
}

export class StringValueComponent extends React.Component<StringValueComponentProps, never> {
    render() {
        return <React.Fragment>
            string value: {this.props.value.type}
        </React.Fragment>;
    }
}
