import * as React from 'react';
import { OperatorSelect } from './operator-select';
import { Fields, Operator, FieldType, isStringOperators, isNumberOperators, isDateOperators, isBooleanOperators } from './model';
import { OperatorStringSelect } from './operator-string-select';
import { OperatorNumberSelect } from './operator-number-select';
import { OperatorDateSelect } from './operator-date-select';
import { OperatorBooleanSelect } from './operator-boolean-select';

export interface FilterSelectProps {
    fields: Fields;
}

export interface FilterSelectState {
    fieldId: string | null;
    operator: Operator | null;
    value: string | number | boolean | null;
}

export class FilterSelect extends React.Component<FilterSelectProps, FilterSelectState> {
    state: FilterSelectState = {
        fieldId: null,
        operator: null
    };

    renderStringSelect() {
        const operator = this.state.operator === null || !isStringOperators(this.state.operator) ? null : this.state.operator;
        return <OperatorStringSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
    }

    renderNumberSelect() {
        const operator = this.state.operator === null || !isNumberOperators(this.state.operator) ? null : this.state.operator;
        return <OperatorNumberSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
    }

    renderDateSelect() {
        const operator = this.state.operator === null || !isDateOperators(this.state.operator) ? null : this.state.operator;
        return <OperatorDateSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
    }

    renderBooleanSelect() {
        const operator = this.state.operator === null || !isBooleanOperators(this.state.operator) ? null : this.state.operator;
        return <OperatorBooleanSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
    }

    renderOperatorSelect() {
        if (this.state.fieldId !== null) {
            switch (this.props.fields[this.state.fieldId].type) {
                case 'string':
                    return this.renderStringSelect();
                case 'number':
                    return this.renderNumberSelect();
                case 'boolean':
                    return this.renderBooleanSelect();
                case 'date':
                    return this.renderDateSelect();
            }
        }
    }

    render() {
        return <React.Fragment>
            <select
                value={this.state.fieldId === null ? '' : this.state.fieldId}
                onChange={(event) => this.setState({ fieldId: event.currentTarget.value, operator: null })}
            >
                <option value="" disabled>Select field</option>
                {Object.keys(this.props.fields).map((key) =>
                    <option key={key} value={key}>{this.props.fields[key].label}</option>
                )}
            </select>
            {this.renderOperatorSelect()}
        </React.Fragment>;
    }
}
