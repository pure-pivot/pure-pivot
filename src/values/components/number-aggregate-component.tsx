import * as React from 'react';
import { NumberAggregate } from '../model';

export interface NumberAggregateComponentProps {
    value: NumberAggregate;
}

export class NumberAggregateComponent extends React.Component<NumberAggregateComponentProps, never> {
    render() {
        return <React.Fragment>
            number aggregate: {this.props.value.type}
        </React.Fragment>;
    }
}
