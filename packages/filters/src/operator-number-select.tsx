import * as React from 'react';
import { NumberOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<NumberOperators['type']>[] = [
    { value: 'number-equals', label: '=' },
    { value: 'number-not-equals', label: '!=' },
    { value: 'number-smaller-than', label: '<' },
    { value: 'number-greater-than', label: '>' },
    { value: 'is-null', label: 'is empty' },
    { value: 'is-not-null', label: 'is not empty' }
];

export interface OperatorNumberSelectProps {
    operator: NumberOperators;
    onOperatorChange: (operator: NumberOperators) => void;
}

export class OperatorNumberSelect extends React.PureComponent<OperatorNumberSelectProps, never> {
    render() {
        const { operator: { type: operatorType} } = this.props;

        return <React.Fragment>
            <OperatorSelect
                value={operatorType}
                options={options}
                onOptionChange={(type: NumberOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as NumberOperators);
                }}
            />
            {operatorType !== 'is-null' && operatorType !== 'is-not-null' && <input
                type="number"
                step="any"
                defaultValue={this.props.operator.value.toString()}
                onChange={(event) => {
                    const value = parseFloat(event.currentTarget.value);
                    if (!Number.isNaN(value)) {
                        this.props.onOperatorChange({ type: operatorType, value } as NumberOperators);
                    }
                }}
            />}
        </React.Fragment>;
    }
}
