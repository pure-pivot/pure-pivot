import * as React from 'react';
import { BooleanOperators } from '../../model';

export interface BooleanInputProps {
    operator: BooleanOperators;
    onOperatorChange: (operator: BooleanOperators) => void;
}

export class BooleanInput extends React.Component<BooleanInputProps, never> {
    render() {
        return <select
            value={this.props.operator.value ? 'true' : 'false'}
            onChange={(event) => {
                this.props.onOperatorChange({ type: this.props.operator.type, value: event.currentTarget.value === 'true' } as BooleanOperators);
            }}
        >
            <option value="true">True</option>
            <option value="false">False</option>
        </select>;
    }
}
