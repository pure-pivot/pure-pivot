import * as React from 'react';
import { Fields, Operator, isStringOperators, isNumberOperators, isDateOperators, isBooleanOperators, Filter } from './model';
import { OperatorStringSelect } from './operator-string-select';
import { OperatorNumberSelect } from './operator-number-select';
import { OperatorDateSelect } from './operator-date-select';
import { OperatorBooleanSelect } from './operator-boolean-select';

export interface FilterSelectProps<D> {
    fields: Fields<D>;
    filter: Filter | null;
    onFilterChange: (filter: Filter) => void;
}

export class FilterSelect<D> extends React.PureComponent<FilterSelectProps<D>, never> {
    renderStringSelect(filter: Filter) {
        if (isStringOperators(filter.operator)) {
            return <OperatorStringSelect operator={filter.operator} onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })} />;
        }
    }

    renderNumberSelect(filter: Filter) {
        if (isNumberOperators(filter.operator)) {
            return <OperatorNumberSelect operator={filter.operator} onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })} />;
        }
    }

    renderDateSelect(filter: Filter) {
        if (isDateOperators(filter.operator)) {
            return <OperatorDateSelect operator={filter.operator} onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })} />;
        }
    }

    renderBooleanSelect(filter: Filter) {
        if (isBooleanOperators(filter.operator)) {
            return <OperatorBooleanSelect operator={filter.operator} onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })} />;
        }
    }

    renderOperatorSelect() {
        if (this.props.filter !== null) {
            switch (this.props.fields[this.props.filter.id].type) {
                case 'string':
                    return this.renderStringSelect(this.props.filter);
                case 'number':
                    return this.renderNumberSelect(this.props.filter);
                case 'boolean':
                    return this.renderBooleanSelect(this.props.filter);
                case 'date':
                    return this.renderDateSelect(this.props.filter);
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

    render() {
        return <React.Fragment>
            <select
                value={this.props.filter === null ? '' : this.props.filter.id}
                onChange={(event) => this.props.onFilterChange({ id: event.currentTarget.value, operator: this.getDefaultOperator(event.currentTarget.value) })}
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
