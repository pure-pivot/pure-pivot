import * as React from 'react';
import { BooleanOperators } from '../../model';

export interface BooleanInputProps<C> {
    context: C;
    operator: BooleanOperators;
    onOperatorChange: (operator: BooleanOperators) => void;
}

export class BooleanInput<C> extends React.Component<BooleanInputProps<C>, never> {
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
