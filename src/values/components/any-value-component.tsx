import * as React from 'react';
import { AnyValue } from '../model';

export interface AnyValueComponentProps {
    value: AnyValue;
}

export class AnyValueComponent extends React.Component<AnyValueComponentProps, never> {
    render() {
        return <React.Fragment>
            any value: {this.props.value.type}
        </React.Fragment>;
    }
}
