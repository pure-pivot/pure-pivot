import * as React from 'react';
import { BooleanValue } from '../model';

export interface BooleanValueComponentProps {
    value: BooleanValue;
}

export class BooleanValueComponent extends React.Component<BooleanValueComponentProps, never> {
    render() {
        return <React.Fragment>
            boolean value: {this.props.value.type}
        </React.Fragment>;
    }
}
