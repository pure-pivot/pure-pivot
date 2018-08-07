import * as React from 'react';
import { Fields, Operator, isStringOperators, isNumberOperators, isDateOperators, isBooleanOperators, Filter } from './model';
import { OperatorStringSelect, OperatorStringSelectProps, OperatorStringSelectProvidedProps } from './operator-components/string/operator-string-select';
import { OperatorNumberSelect, OperatorNumberSelectProps, OperatorNumberSelectProvidedProps } from './operator-components/number/operator-number-select';
import { OperatorDateSelect, OperatorDateSelectProps, OperatorDateSelectProvidedProps } from './operator-components/date/operator-date-select';
import { OperatorBooleanSelect, OperatorBooleanSelectProps, OperatorBooleanSelectProvidedProps } from './operator-components/boolean/operator-boolean-select';

export interface ControlledFilterSelectProps<D> {
    fields: Fields<D>;
    filter: Filter | null;
    onFilterChange: (filter: Filter) => void;
    onFilterSave: () => void;
    stringSelectComponent: React.ComponentType<Pick<OperatorStringSelectProps, Exclude<keyof OperatorStringSelectProps, OperatorStringSelectProvidedProps>>>;
    numberSelectComponent: React.ComponentType<Pick<OperatorNumberSelectProps, Exclude<keyof OperatorNumberSelectProps, OperatorNumberSelectProvidedProps>>>;
    dateSelectComponent: React.ComponentType<Pick<OperatorDateSelectProps, Exclude<keyof OperatorDateSelectProps, OperatorDateSelectProvidedProps>>>;
    booleanSelectComponent: React.ComponentType<Pick<OperatorBooleanSelectProps, Exclude<keyof OperatorBooleanSelectProps, OperatorBooleanSelectProvidedProps>>>;
}

export type ControlledFilterSelectProvidedProps = 'stringSelectComponent' | 'numberSelectComponent' | 'dateSelectComponent' | 'booleanSelectComponent';

export class ControlledFilterSelect<D> extends React.PureComponent<ControlledFilterSelectProps<D>, never> {
    renderStringSelect(filter: Filter) {
        if (isStringOperators(filter.operator)) {
            return <this.props.stringSelectComponent
                operator={filter.operator}
                onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })}
            />;
        }
    }

    renderNumberSelect(filter: Filter) {
        if (isNumberOperators(filter.operator)) {
            return <this.props.numberSelectComponent
                operator={filter.operator}
                onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })}
            />;
        }
    }

    renderDateSelect(filter: Filter) {
        if (isDateOperators(filter.operator)) {
            return <this.props.dateSelectComponent
                operator={filter.operator}
                onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })}
            />;
        }
    }

    renderBooleanSelect(filter: Filter) {
        if (isBooleanOperators(filter.operator)) {
            return <this.props.booleanSelectComponent
                operator={filter.operator}
                onOperatorChange={(operator) => this.props.onFilterChange({ ...filter, operator })}
            />;
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

    renderSave() {
        if (this.props.filter !== null) {
            return <button type="submit">
                Save
            </button>;
        }
    }

    render() {
        return <form
            onSubmit={(event) => {
                event.preventDefault();
                this.props.onFilterSave();
            }}
        >
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
            {this.renderSave()}
        </form>;
    }
}
