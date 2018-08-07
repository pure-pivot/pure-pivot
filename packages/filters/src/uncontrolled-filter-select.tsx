import * as React from 'react';
import { Fields, Operator, isStringOperators, isNumberOperators, isDateOperators, isBooleanOperators, Filter } from './model';
import { OperatorStringSelect, OperatorStringSelectProps, OperatorStringSelectProvidedProps } from './operator-components/string/operator-string-select';
import { OperatorNumberSelect, OperatorNumberSelectProps, OperatorNumberSelectProvidedProps } from './operator-components/number/operator-number-select';
import { OperatorDateSelect, OperatorDateSelectProps, OperatorDateSelectProvidedProps } from './operator-components/date/operator-date-select';
import { OperatorBooleanSelect, OperatorBooleanSelectProps, OperatorBooleanSelectProvidedProps } from './operator-components/boolean/operator-boolean-select';

// TODO: this module can probably be replaced by a combination of controlled version + something like https://www.npmjs.com/package/uncontrollable

export interface UncontrolledFilterSelectProps<D> {
    fields: Fields<D>;
    defaultFilter: Filter | null;
    onFilterChange: (filter: Filter) => void;
    stringSelectComponent: React.ComponentType<Pick<OperatorStringSelectProps, Exclude<keyof OperatorStringSelectProps, OperatorStringSelectProvidedProps>>>;
    numberSelectComponent: React.ComponentType<Pick<OperatorNumberSelectProps, Exclude<keyof OperatorNumberSelectProps, OperatorNumberSelectProvidedProps>>>;
    dateSelectComponent: React.ComponentType<Pick<OperatorDateSelectProps, Exclude<keyof OperatorDateSelectProps, OperatorDateSelectProvidedProps>>>;
    booleanSelectComponent: React.ComponentType<Pick<OperatorBooleanSelectProps, Exclude<keyof OperatorBooleanSelectProps, OperatorBooleanSelectProvidedProps>>>;
}

export interface UncontrolledFilterSelectState {
    id: string | null;
    operator: Operator | null;
}

export type UncontrolledFilterSelectProvidedProps = 'stringSelectComponent' | 'numberSelectComponent' | 'dateSelectComponent' | 'booleanSelectComponent';

export class UncontrolledFilterSelect<D> extends React.PureComponent<UncontrolledFilterSelectProps<D>, UncontrolledFilterSelectState> {
    state: UncontrolledFilterSelectState = {
        id: this.props.defaultFilter && this.props.defaultFilter.id,
        operator: this.props.defaultFilter && this.props.defaultFilter.operator
    };

    handleOperatorChange(operator: Operator) {
        this.setState({ operator });
        if (this.state.id !== null) {
            this.props.onFilterChange({
                id: this.state.id,
                operator
            });
        }
    }

    handleFieldChange(id: string) {
        const filter = { id, operator: this.getDefaultOperator(id) };
        this.setState(filter);
        this.props.onFilterChange(filter);
    }

    renderStringSelect(operator: Operator) {
        if (isStringOperators(operator)) {
            return <this.props.stringSelectComponent
                operator={operator}
                onOperatorChange={(operator) => this.setState({ operator })}
            />;
        }
    }

    renderNumberSelect(operator: Operator) {
        if (isNumberOperators(operator)) {
            return <this.props.numberSelectComponent
                operator={operator}
                onOperatorChange={(operator) => this.setState({ operator })}
            />;
        }
    }

    renderDateSelect(operator: Operator) {
        if (isDateOperators(operator)) {
            return <this.props.dateSelectComponent
                operator={operator}
                onOperatorChange={(operator) => this.setState({ operator })}
            />;
        }
    }

    renderBooleanSelect(operator: Operator) {
        if (isBooleanOperators(operator)) {
            return <this.props.booleanSelectComponent
                operator={operator}
                onOperatorChange={(operator) => this.setState({ operator })}
            />;
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

    render() {
        return <React.Fragment>
            <select
                value={this.state.id === null ? '' : this.state.id}
                onChange={(event) => this.handleFieldChange(event.currentTarget.value)}
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
