import * as React from 'react';
import { GroupByOtherEquality } from '../model';

export interface OtherEqualityComponentProps<T> {
    groupBy: GroupByOtherEquality<T>;
}

export class OtherEqualityComponent<T> extends React.Component<OtherEqualityComponentProps<T>, never> {
    render() {
        return <React.Fragment>
            =
        </React.Fragment>;
    }
}
