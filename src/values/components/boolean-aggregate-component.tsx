import * as React from 'react';
import { BooleanAggregate } from '../model';

export interface BooleanAggregateComponentProps {
    value: BooleanAggregate;
}

export class BooleanAggregateComponent extends React.Component<BooleanAggregateComponentProps, never> {
    render() {
        return <React.Fragment>
            boolean aggregate: {this.props.value.type}
        </React.Fragment>;
    }
}
