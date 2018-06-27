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

export class OperatorNumberSelect extends React.Component<OperatorNumberSelectProps, never> {
    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: NumberOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as NumberOperators);
                }}
            />
        </React.Fragment>;
    }
}
