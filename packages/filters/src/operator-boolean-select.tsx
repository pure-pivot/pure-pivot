import * as React from 'react';
import { BooleanOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<BooleanOperators['type']>[] = [
    { value: 'boolean-equals', label: '=' },
    { value: 'boolean-not-equals', label: '!=' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' }
];

export interface OperatorBooleanSelectProps {
    operator: BooleanOperators;
    onOperatorChange: (operator: BooleanOperators) => void;
}

export class OperatorBooleanSelect extends React.PureComponent<OperatorBooleanSelectProps, never> {
    render() {
        const { operator: { type: operatorType} } = this.props;

        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: BooleanOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as BooleanOperators);
                }}
            />
            {operatorType !== 'is-empty' && operatorType !== 'is-not-empty' && <select
                value={this.props.operator.value ? 'true' : 'false'}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: operatorType, value: event.currentTarget.value === 'true' } as BooleanOperators);
                }}
            >
                <option value="true">True</option>
                <option value="false">False</option>
            </select>}
        </React.Fragment>;
    }
}
