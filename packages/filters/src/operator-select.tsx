import * as React from 'react';

export interface Option<T extends string> {
    value: T;
    label: string;
}

export interface OperatorSelectProps<T extends string> {
    value: T | null;
    options: Option<T>[];
    onOptionChange: (value: T) => void;
}

export class OperatorSelect<T extends string> extends React.Component<OperatorSelectProps<T>, never> {
    render() {
        return <select value={this.props.value === null ? '' : this.props.value} onChange={(event) => this.props.onOptionChange(event.currentTarget.value as T)}>
            <option value="" disabled>Select operator</option>
            {this.props.options.map((option) =>
                <option key={option.value} value={option.value}>{option.label}</option>
            )}
        </select>;
    }
}
