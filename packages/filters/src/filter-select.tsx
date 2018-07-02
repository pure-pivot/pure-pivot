import * as React from 'react';
import { OperatorSelect } from './operator-select';
import { Fields, Operator, FieldType, isStringOperators, isNumberOperators, isDateOperators, isBooleanOperators, Filter } from './model';
import { OperatorStringSelect } from './operator-string-select';
import { OperatorNumberSelect } from './operator-number-select';
import { OperatorDateSelect } from './operator-date-select';
import { OperatorBooleanSelect } from './operator-boolean-select';

export interface FilterSelectProps {
    fields: Fields;
    defaultFilter: Filter | null;
    onFilterChange: (filter: Filter) => void;
}

export interface FilterSelectState {
    fieldId: string | null;
    operator: Operator | null;
}

export class FilterSelect extends React.PureComponent<FilterSelectProps, FilterSelectState> {
    state: FilterSelectState = {
        fieldId: this.props.defaultFilter && this.props.defaultFilter.fieldId,
        operator: this.props.defaultFilter && this.props.defaultFilter.operator
    };

    renderStringSelect(operator: Operator) {
        if (isStringOperators(operator)) {
            return <OperatorStringSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
        }
    }

    renderNumberSelect(operator: Operator) {
        if (isNumberOperators(operator)) {
            return <OperatorNumberSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
        }
    }

    renderDateSelect(operator: Operator) {
        if (isDateOperators(operator)) {
            return <OperatorDateSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
        }
    }

    renderBooleanSelect(operator: Operator) {
        if (isBooleanOperators(operator)) {
            return <OperatorBooleanSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
        }
    }

    renderOperatorSelect() {
        if (this.state.fieldId !== null && this.state.operator !== null) {
            switch (this.props.fields[this.state.fieldId].type) {
                case 'string':
                    return this.renderStringSelect(this.state.operator);
                case 'number':
                    return this.renderNumberSelect(this.state.operator);
                case 'boolean':
                    return this.renderBooleanSelect(this.state.operator);
                case 'date':
                    return this.renderDateSelect(this.state.operator);
            }
        }
    }

    getDefaultOperator(fieldId: string): Operator {
        switch (this.props.fields[fieldId].type) {
            case 'string':
                return { type: 'string-equals', value: '' };
            case 'number':
                return { type: 'number-equals', value: 0 };
            case 'boolean':
                return { type: 'boolean-equals', value: true };
            case 'date':
                return { type: 'date-equals', value: Date.now() };
        }
    }

    renderSave() {
        if (this.state.fieldId !== null && this.state.operator !== null) {
            return <button type="submit">
                Save
            </button>;
        }
    }

    render() {
        return <form
            onSubmit={(event) => {
                event.preventDefault();
                if (this.state.fieldId !== null && this.state.operator !== null) {
                    this.props.onFilterChange({ fieldId: this.state.fieldId, operator: this.state.operator });
                }
            }}
        >
            <select
                value={this.state.fieldId === null ? '' : this.state.fieldId}
                onChange={(event) => this.setState({ fieldId: event.currentTarget.value, operator: this.getDefaultOperator(event.currentTarget.value) })}
            >
                <option value="" disabled>Select field</option>
                {Object.keys(this.props.fields).map((key) =>
                    <option key={key} value={key}>{this.props.fields[key].label}</option>
                )}
            </select>
            {this.renderOperatorSelect()}
            {this.renderSave()}
        </form>;
    }
}
