import * as React from 'react';
import { Fields, Operator, isStringOperators, isNumberOperators, isDateOperators, isBooleanOperators, Filter } from './model';
import { OperatorStringSelect, InputComponentProps as StringInputComponentProps } from './operator-string-select';
import { OperatorNumberSelect, InputComponentProps as NumberInputComponentProps } from './operator-number-select';
import { OperatorDateSelect, InputComponentProps as DateInputComponentProps } from './operator-date-select';
import { OperatorBooleanSelect } from './operator-boolean-select';

// TODO: this module can probably be replaced by a combination of controlled version + something like https://www.npmjs.com/package/uncontrollable

export interface FilterSelectInputComponents {
    date?: React.ComponentType<DateInputComponentProps>;
    number?: React.ComponentType<NumberInputComponentProps>;
    string?: React.ComponentType<StringInputComponentProps>;
}

export interface FilterSelectProps<D> {
    fields: Fields<D>;
    defaultFilter: Filter | null;
    onFilterChange: (filter: Filter) => void;
    filterSelectInputComponents?: FilterSelectInputComponents;
}

export interface FilterSelectState {
    id: string | null;
    operator: Operator | null;
}

export class FilterSelect<D> extends React.PureComponent<FilterSelectProps<D>, FilterSelectState> {
    state: FilterSelectState = {
        id: this.props.defaultFilter && this.props.defaultFilter.id,
        operator: this.props.defaultFilter && this.props.defaultFilter.operator
    };

    renderStringSelect(operator: Operator) {
        if (isStringOperators(operator)) {
            return <OperatorStringSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} inputComponent={this.props.filterSelectInputComponents && this.props.filterSelectInputComponents.string} />;
        }
    }

    renderNumberSelect(operator: Operator) {
        if (isNumberOperators(operator)) {
            return <OperatorNumberSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} inputComponent={this.props.filterSelectInputComponents && this.props.filterSelectInputComponents.number} />;
        }
    }

    renderDateSelect(operator: Operator) {
        if (isDateOperators(operator)) {
            return <OperatorDateSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} inputComponent={this.props.filterSelectInputComponents && this.props.filterSelectInputComponents.date} />;
        }
    }

    renderBooleanSelect(operator: Operator) {
        if (isBooleanOperators(operator)) {
            return <OperatorBooleanSelect operator={operator} onOperatorChange={(operator) => this.setState({ operator })} />;
        }
    }

    renderOperatorSelect() {
        if (this.state.id !== null && this.state.operator !== null) {
            switch (this.props.fields[this.state.id].type) {
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

    getDefaultOperator(id: string): Operator {
        switch (this.props.fields[id].type) {
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
        if (this.state.id !== null && this.state.operator !== null) {
            return <button type="submit">
                Save
            </button>;
        }
    }

    render() {
        return <form
            onSubmit={(event) => {
                event.preventDefault();
                if (this.state.id !== null && this.state.operator !== null) {
                    this.props.onFilterChange({ id: this.state.id, operator: this.state.operator });
                }
            }}
        >
            <select
                value={this.state.id === null ? '' : this.state.id}
                onChange={(event) => this.setState({ id: event.currentTarget.value, operator: this.getDefaultOperator(event.currentTarget.value) })}
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
