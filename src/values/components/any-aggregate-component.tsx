import * as React from 'react';
import { AnyAggregate } from '../model';

export interface AnyAggregateComponentProps {
    value: AnyAggregate;
}

export class AnyAggregateComponent extends React.Component<AnyAggregateComponentProps, never> {
    render() {
        return <React.Fragment>
            any aggregate: {this.props.value.type}
        </React.Fragment>;
    }
}
