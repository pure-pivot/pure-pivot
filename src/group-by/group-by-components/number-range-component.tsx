import * as React from 'react';
import { GroupByNumberRange } from '../model';

export interface NumberRangeComponentProps {
    groupBy: GroupByNumberRange;
}

export class NumberRangeComponent extends React.Component<NumberRangeComponentProps, never> {
    render() {
        return <React.Fragment>
            Bucket range: {this.props.groupBy.range}
        </React.Fragment>;
    }
}
