import * as React from 'react';
import { StringOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<StringOperators['type']>[] = [
    { value: 'string-equals', label: '=' },
    { value: 'string-not-equals', label: '!=' },
    { value: 'string-contains', label: 'contains' },
    { value: 'is-null', label: 'is empty' },
    { value: 'is-not-null', label: 'is not empty' }
];

export interface OperatorStringSelectProps {
    operator: StringOperators;
    onOperatorChange: (operator: StringOperators) => void;
}

export class OperatorStringSelect extends React.PureComponent<OperatorStringSelectProps, never> {
    render() {
        const { operator: { type: operatorType} } = this.props;

        return <React.Fragment>
            <OperatorSelect
                value={operatorType}
                options={options}
                onOptionChange={(type: StringOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as StringOperators);
                }}
            />
            {operatorType !== 'is-null' && operatorType !== 'is-not-null' && <input
                type="text"
                value={this.props.operator.value}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: operatorType, value: event.currentTarget.value } as StringOperators);
                }}
            />}
        </React.Fragment>;
    }
}
