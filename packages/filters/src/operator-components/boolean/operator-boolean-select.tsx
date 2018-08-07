import * as React from 'react';
import { BooleanOperators } from '../../model';
import { OperatorSelect, Option } from '../../operator-select';
import { BooleanInputProps } from './boolean-input';

const options: Option<BooleanOperators['type']>[] = [
    { value: 'boolean-equals', label: '=' },
    { value: 'boolean-not-equals', label: '!=' },
    { value: 'is-empty', label: 'is empty' },
    { value: 'is-not-empty', label: 'is not empty' }
];

export interface OperatorBooleanSelectProps {
    operator: BooleanOperators;
    onOperatorChange: (operator: BooleanOperators) => void;
    booleanInputComponent: React.ComponentType<BooleanInputProps>;
}

export type OperatorBooleanSelectProvidedProps = 'booleanInputComponent';

export class OperatorBooleanSelect extends React.PureComponent<OperatorBooleanSelectProps, never> {
    renderInputComponent() {
        if (this.props.operator.type !== 'is-empty' && this.props.operator.type !== 'is-not-empty') {
            return <this.props.booleanInputComponent
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
                onOptionChange={(type: BooleanOperators['type']) => {
                    this.props.onOperatorChange({ type, value: this.props.operator.value } as BooleanOperators);
                }}
            />
            {this.renderInputComponent()}
        </React.Fragment>;
    }
}
