import * as React from 'react';
import { StringOperators } from './model';
import { OperatorSelect, Option } from './operator-select';

const options: Option<StringOperators['type']>[] = [
    { value: 'string-equals', label: '=' },
    { value: 'string-not-equals', label: '!=' },
    { value: 'string-contains', label: 'contains' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' }
];

export interface InputComponentProps {
    operator: StringOperators;
    onOperatorChange: (operator: StringOperators) => void;
}

export interface OperatorStringSelectProps extends InputComponentProps {
    inputComponent?: React.ComponentType<InputComponentProps>;
}

export class OperatorStringSelect extends React.PureComponent<OperatorStringSelectProps, never> {
    renderInputComponent() {
        if (this.props.operator.type !== 'is-empty' && this.props.operator.type !== 'is-not-empty') {
            if (this.props.inputComponent) {
                return <this.props.inputComponent
                    operator={this.props.operator}
                    onOperatorChange={(changedOperator: StringOperators) => this.props.onOperatorChange(changedOperator) }
                />;
            }

            return <input
                type="text"
                value={this.props.operator.value}
                onChange={(event) => {
                    this.props.onOperatorChange({ type: this.props.operator.type, value: event.currentTarget.value } as StringOperators);
                }}
            />;
        }
    }

    render() {
        return <React.Fragment>
            <OperatorSelect
                value={this.props.operator.type}
                options={options}
                onOptionChange={(type: StringOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as StringOperators);
                }}
            />
            {this.renderInputComponent()}
        </React.Fragment>;
    }
}
