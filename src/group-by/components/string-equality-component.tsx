import * as React from 'react';
import { GroupByStringEquality } from '../model';

export interface StringEqualityComponentProps {
    groupBy: GroupByStringEquality;
}

export class StringEqualityComponent extends React.Component<StringEqualityComponentProps, never> {
    render() {
        return <React.Fragment>
            =
        </React.Fragment>;
    }
}
