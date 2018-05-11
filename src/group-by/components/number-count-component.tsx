import * as React from 'react';
import { GroupByNumberCount } from '../model';

export interface NumberCountComponentProps {
    groupBy: GroupByNumberCount;
}

export class NumberCountComponent extends React.Component<NumberCountComponentProps, never> {
    render() {
        return <React.Fragment>
            Bucket count: {this.props.groupBy.count}
        </React.Fragment>;
    }
}
