import * as React from 'react';
import { BooleanOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<BooleanOperators['type']>[] = [
    { value: 'boolean-equals', label: '=' },
    { value: 'boolean-not-equals', label: '!=' }
];

export interface OperatorBooleanSelectProps {
    operator: BooleanOperators;
    onOperatorChange: (operator: BooleanOperators) => void;
}

export class OperatorBooleanSelect extends React.PureComponent<OperatorBooleanSelectProps, never> {
    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: BooleanOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as BooleanOperators);
                }}
            />
            <select
                value={this.props.operator.value ? 'true' : 'false'}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: this.props.operator.type, value: event.currentTarget.value === 'true' } as BooleanOperators);
                }}
            >
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
        </React.Fragment>;
    }
}
