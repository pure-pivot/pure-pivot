import * as React from 'react';
import { ControlledFilterSelectProps, ControlledFilterSelectProvidedProps } from './controlled-filter-select';
import { Fields, Filter } from './model';

export interface NullableFilters {
    [Key: string]: Filter | null;
}

export interface ControlledFiltersSelectProps<D> {
    fields: Fields<D>;
    filters: NullableFilters;
    onFiltersChange: (filters: NullableFilters) => void;
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<{}>;
    controlledFilterSelectComponent: React.ComponentType<Pick<ControlledFilterSelectProps<D>, Exclude<keyof ControlledFilterSelectProps<D>, ControlledFilterSelectProvidedProps>>>;
}

export type ControlledFiltersSelectProvidedProps = 'filtersContainerComponent' | 'filtersItemComponent' | 'controlledFilterSelectComponent';

export class ControlledFiltersSelect<D> extends React.PureComponent<ControlledFiltersSelectProps<D>, never> {
    counter: number = 0;

    handleAdd() {
        while (this.counter.toString() in this.props.filters) {
            this.counter += 1;
        }
        this.props.onFiltersChange({ ...this.props.filters, [this.counter.toString()]: null });
    }

    handleFilterChange(key: string, filter: Filter) {
        const newFilters = { ...this.props.filters };
        newFilters[key] = filter;
        this.props.onFiltersChange(newFilters);
    }

    handleFilterRemove(key: string) {
        const newFilters = { ...this.props.filters };
        delete newFilters[key];
        this.props.onFiltersChange(newFilters);
    }

    handleFilterRemoveAll() {
        this.props.onFiltersChange({});
    }

    render() {
        return <React.Fragment>
            <button type="button" onClick={() => this.handleAdd()}>
                Add filter
            </button>
            <button type="button" disabled={Object.keys(this.props.filters).length === 0} onClick={() => this.handleFilterRemoveAll()}>
                Remove all
            </button>
            <this.props.filtersContainerComponent>
                {Object.keys(this.props.filters).map((key) =>
                    <this.props.filtersItemComponent key={key}>
                        <this.props.controlledFilterSelectComponent
                            fields={this.props.fields}
                            filter={this.props.filters[key]}
                            onFilterChange={(filter) => this.handleFilterChange(key, filter)}
                        />
                        <button type="button" onClick={() => this.handleFilterRemove(key)}>
                            Remove
                        </button>
                    </this.props.filtersItemComponent>
                )}
            </this.props.filtersContainerComponent>
        </React.Fragment>;
    }
}
