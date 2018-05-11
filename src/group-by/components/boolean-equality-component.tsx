import * as React from 'react';
import { GroupByBooleanEquality } from '../model';

export interface BooleanEqualityComponentProps {
    groupBy: GroupByBooleanEquality;
}

export class BooleanEqualityComponent extends React.Component<BooleanEqualityComponentProps, never> {
    render() {
        return <React.Fragment>
            =
        </React.Fragment>;
    }
}
