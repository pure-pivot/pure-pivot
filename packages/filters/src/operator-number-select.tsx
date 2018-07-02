import * as React from 'react';
import { NumberOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<NumberOperators['type']>[] = [
    { value: 'number-equals', label: '=' },
    { value: 'number-not-equals', label: '!=' }
];

export interface OperatorNumberSelectProps {
    operator: NumberOperators;
    onOperatorChange: (operator: NumberOperators) => void;
}

export class OperatorNumberSelect extends React.PureComponent<OperatorNumberSelectProps, never> {
    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: NumberOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as NumberOperators);
                }}
            />
            <input
                type="number"
                step="any"
                defaultValue={this.props.operator.value.toString()}
                onChange={(event) => {
                    const value = parseFloat(event.currentTarget.value);
                    if (!Number.isNaN(value)) {
                        this.props.onOperatorChange({ type: this.props.operator.type, value } as NumberOperators);
                    }
                }}
            />
        </React.Fragment>;
    }
}
