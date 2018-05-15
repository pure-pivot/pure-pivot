import * as React from 'react';
import { Value, isBooleanValue, isNumberValue, isStringValue, isOtherValue, AnyValue, isAnyValue, ValueDescription } from './model';
import { Field } from '../fields/model';
import { AnyValueComponentProps } from './components/any-value-component';
import { BooleanValueComponentProps } from './components/boolean-value-component';
import { NumberValueComponentProps } from './components/number-value-component';
import { StringValueComponentProps } from './components/string-value-component';
import { OtherValueComponentProps } from './components/other-value-component';

export interface ValueComponentProps<D, F extends keyof D> {
    value: ValueDescription<D, F>;
    anyValueComponent: React.ComponentType<AnyValueComponentProps>;
    booleanValueComponent: React.ComponentType<BooleanValueComponentProps>;
    numberValueComponent: React.ComponentType<NumberValueComponentProps>;
    stringValueComponent: React.ComponentType<StringValueComponentProps>;
    otherValueComponent: React.ComponentType<OtherValueComponentProps<D[F]>>;
}

export type ValueComponentProvidedProps = 'anyValueComponent' | 'booleanValueComponent' | 'numberValueComponent' | 'stringValueComponent' | 'otherValueComponent';

export class ValueComponent<D, F extends keyof D> extends React.Component<ValueComponentProps<D, F>, never> {
    renderValue() {
        if (isAnyValue(this.props.value.value)) {
            return <this.props.anyValueComponent value={this.props.value.value} />;
        } else if (isBooleanValue(this.props.value.value)) {
            return <this.props.booleanValueComponent value={this.props.value.value} />;
        } else if (isNumberValue(this.props.value.value)) {
            return <this.props.numberValueComponent value={this.props.value.value} />;
        } else if (isStringValue(this.props.value.value)) {
            return <this.props.stringValueComponent value={this.props.value.value} />;
        } else if (isOtherValue(this.props.value.value)) {
            return <this.props.otherValueComponent value={this.props.value.value} />;
        }
    }

    render() {
        return <li>
            {this.props.value.name}
            ({this.props.value.id}) - {this.renderValue()}
        </li>;
    }
}
