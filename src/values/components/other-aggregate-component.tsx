import * as React from 'react';
import { OtherAggregate } from '../model';

export interface OtherAggregateComponentProps<T> {
    value: OtherAggregate<T>;
}

export class OtherAggregateComponent<T> extends React.Component<OtherAggregateComponentProps<T>, never> {
    render() {
        return <React.Fragment>
            other aggregate: {this.props.value.type}
        </React.Fragment>;
    }
}
