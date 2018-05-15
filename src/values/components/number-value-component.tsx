import * as React from 'react';
import { NumberValue } from '../model';

export interface NumberValueComponentProps {
    value: NumberValue;
}

export class NumberValueComponent extends React.Component<NumberValueComponentProps, never> {
    render() {
        return <React.Fragment>
            number value: {this.props.value.type}
        </React.Fragment>;
    }
}
