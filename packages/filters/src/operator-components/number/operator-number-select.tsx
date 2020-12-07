import * as React from 'react';
import { NumberOperators } from '../../model';
import { OperatorSelect, Option } from '../../operator-select';
import { NumberInputProps } from './number-input';

const options: Option<NumberOperators['type']>[] = [
    { value: 'number-equals', label: '=' },
    { value: 'number-not-equals', label: '!=' },
    { value: 'number-smaller-than', label: '<' },
    { value: 'number-greater-than', label: '>' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' }
];

export interface OperatorNumberSelectProps<C> {
    context: C;
    operator: NumberOperators;
    onOperatorChange: (operator: NumberOperators) => void;
    numberInputComponent: React.ComponentType<NumberInputProps<C>>;
}

export type OperatorNumberSelectProvidedProps = 'numberInputComponent';

export class OperatorNumberSelect<C> extends React.PureComponent<OperatorNumberSelectProps<C>, never> {
    renderInputComponent(): any {
        if (this.props.operator.type !== 'is-empty' && this.props.operator.type !== 'is-not-empty') {
            return <this.props.numberInputComponent
                context={this.props.context}
                operator={this.props.operator}
                onOperatorChange={this.props.onOperatorChange}
            />;
        }
    }

    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: NumberOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as NumberOperators);
                }}
            />
            {this.renderInputComponent()}
        </React.Fragment>;
    }
}
