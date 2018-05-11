import * as React from 'react';
import { GroupBy, isGroupByBooleanEquality, isGroupByNumberEquality, isGroupByNumberCount, isGroupByNumberRange, isGroupByStringEquality, isGroupByOtherEquality } from '../model';
import { BooleanEqualityComponentProps } from './boolean-equality-component';
import { NumberEqualityComponentProps } from './number-equality-component';
import { NumberCountComponentProps } from './number-count-component';
import { NumberRangeComponentProps } from './number-range-component';
import { StringEqualityComponentProps } from './string-equality-component';
import { OtherEqualityComponentProps } from './other-equality-component';

export interface GroupByComponentProps<T> {
    groupBy: GroupBy<T>;
    booleanEqualityComponent: React.ComponentType<BooleanEqualityComponentProps>;
    numberEqualityComponent: React.ComponentType<NumberEqualityComponentProps>;
    numberCountComponent: React.ComponentType<NumberCountComponentProps>;
    numberRangeComponent: React.ComponentType<NumberRangeComponentProps>;
    stringEqualityComponent: React.ComponentType<StringEqualityComponentProps>;
    otherEqualityComponent: React.ComponentType<OtherEqualityComponentProps<T>>;
}

export type GroupByComponentProvidedProps = 'booleanEqualityComponent' | 'numberEqualityComponent' | 'numberCountComponent' | 'numberRangeComponent' | 'stringEqualityComponent' | 'otherEqualityComponent';

export class GroupByComponent<T> extends React.Component<GroupByComponentProps<T>, never> {
    render() {
        if (isGroupByBooleanEquality(this.props.groupBy)) {
            return <this.props.booleanEqualityComponent groupBy={this.props.groupBy} />;
        } else if (isGroupByNumberEquality(this.props.groupBy)) {
            return <this.props.numberEqualityComponent groupBy={this.props.groupBy} />;
        } else if (isGroupByNumberCount(this.props.groupBy)) {
            return <this.props.numberCountComponent groupBy={this.props.groupBy} />;
        } else if (isGroupByNumberRange(this.props.groupBy)) {
            return <this.props.numberRangeComponent groupBy={this.props.groupBy} />;
        } else if (isGroupByStringEquality(this.props.groupBy)) {
            return <this.props.stringEqualityComponent groupBy={this.props.groupBy} />;
        } else if (isGroupByOtherEquality(this.props.groupBy)) {
            return <this.props.otherEqualityComponent groupBy={this.props.groupBy} />;
        }
    }
}
