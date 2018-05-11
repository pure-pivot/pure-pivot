import * as React from 'react';
import { Aggregate, isBooleanAggregate, isNumberAggregate, isStringAggregate, isOtherAggregate, AnyAggregate, isAnyAggregate, AggregateDescription } from './model';
import { Field } from '../fields/model';
import { AnyAggregateComponentProps } from './components/any-aggregate-component';
import { BooleanAggregateComponentProps } from './components/boolean-aggregate-component';
import { NumberAggregateComponentProps } from './components/number-aggregate-component';
import { StringAggregateComponentProps } from './components/string-aggregate-component';
import { OtherAggregateComponentProps } from './components/other-aggregate-component';

export interface AggregateComponentProps<D, F extends keyof D> {
    value: AggregateDescription<D, F>;
    anyAggregateComponent: React.ComponentType<AnyAggregateComponentProps>;
    booleanAggregateComponent: React.ComponentType<BooleanAggregateComponentProps>;
    numberAggregateComponent: React.ComponentType<NumberAggregateComponentProps>;
    stringAggregateComponent: React.ComponentType<StringAggregateComponentProps>;
    otherAggregateComponent: React.ComponentType<OtherAggregateComponentProps<D[F]>>;
}

export type AggregateComponentProvidedProps = 'anyAggregateComponent' | 'booleanAggregateComponent' | 'numberAggregateComponent' | 'stringAggregateComponent' | 'otherAggregateComponent';

export class AggregateComponent<D, F extends keyof D> extends React.Component<AggregateComponentProps<D, F>, never> {
    renderAggregate() {
        if (isAnyAggregate(this.props.value.aggregate)) {
            return <this.props.anyAggregateComponent value={this.props.value.aggregate} />;
        } else if (isBooleanAggregate(this.props.value.aggregate)) {
            return <this.props.booleanAggregateComponent value={this.props.value.aggregate} />;
        } else if (isNumberAggregate(this.props.value.aggregate)) {
            return <this.props.numberAggregateComponent value={this.props.value.aggregate} />;
        } else if (isStringAggregate(this.props.value.aggregate)) {
            return <this.props.stringAggregateComponent value={this.props.value.aggregate} />;
        } else if (isOtherAggregate(this.props.value.aggregate)) {
            return <this.props.otherAggregateComponent value={this.props.value.aggregate} />;
        }
    }

    render() {
        return <li>
            {this.props.value.name}
            ({this.props.value.id}) - {this.renderAggregate()}
        </li>;
    }
}
