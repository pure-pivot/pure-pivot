import * as React from 'react';
import { NumberOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<NumberOperators['type']>[] = [
    { value: 'number-equals', label: '=' },
    { value: 'number-not-equals', label: '!=' },
    { value: 'number-smaller-than', label: '<' },
    { value: 'number-greater-than', label: '>' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' }
];

export interface InputComponentProps {
    operator: NumberOperators;
    onOperatorChange: (operator: NumberOperators) => void;
}

export interface OperatorNumberSelectProps extends InputComponentProps {
    inputComponent?: React.ComponentType<InputComponentProps>;
}

export class OperatorNumberSelect extends React.PureComponent<OperatorNumberSelectProps, never> {
    renderInputComponent(): any {
        if (this.props.operator.type !== 'is-empty' && this.props.operator.type !== 'is-not-empty') {
            if (this.props.inputComponent) {
                return <this.props.inputComponent
                    operator={this.props.operator}
                    onOperatorChange={(changedOperator: NumberOperators) => this.props.onOperatorChange(changedOperator) }
                />;
            }
            return <input
                type="number"
                step="any"
                defaultValue={this.props.operator.value.toString()}
                onChange={(event) => {
                    const value = parseFloat(event.currentTarget.value);
                    if (!Number.isNaN(value)) {
                        this.props.onOperatorChange({ type: this.props.operator.type, value } as NumberOperators);
                    }
                }}
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
