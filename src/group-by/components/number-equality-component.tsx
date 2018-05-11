import * as React from 'react';
import { GroupByNumberEquality } from '../model';

export interface NumberEqualityComponentProps {
    groupBy: GroupByNumberEquality;
}

export class NumberEqualityComponent extends React.Component<NumberEqualityComponentProps, never> {
    render() {
        return <React.Fragment>
            =
        </React.Fragment>;
    }
}
