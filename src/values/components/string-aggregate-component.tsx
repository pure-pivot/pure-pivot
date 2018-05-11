import * as React from 'react';
import { StringAggregate } from '../model';

export interface StringAggregateComponentProps {
    value: StringAggregate;
}

export class StringAggregateComponent extends React.Component<StringAggregateComponentProps, never> {
    render() {
        return <React.Fragment>
            string aggregate: {this.props.value.type}
        </React.Fragment>;
    }
}
