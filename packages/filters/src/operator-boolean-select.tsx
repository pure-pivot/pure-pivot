import * as React from 'react';
import { BooleanOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<BooleanOperators['type']>[] = [
    { value: 'boolean-equals', label: '=' },
    { value: 'boolean-not-equals', label: '!=' }
];

export interface OperatorBooleanSelectProps {
    operator: BooleanOperators | null;
    onOperatorChange: (operator: BooleanOperators) => void;
}

export class OperatorBooleanSelect extends React.Component<OperatorBooleanSelectProps, never> {
    render() {
        const type = this.props.operator === null ? null : this.props.operator.type;
        const value = this.props.operator === null ? '' : this.props.operator.value;

        return <React.Fragment>
            <OperatorSelect
                value={type}
                options={options}
                onOptionChange={(type: BooleanOperators['type']) => {
                    this.props.onOperatorChange({ type, value } as BooleanOperators);
                }}
            />
        </React.Fragment>;
    }
}
