import * as React from 'react';
import { FilterSelect } from './controlled-filter-select';
import { Fields, Filters, Filter } from './model';

export interface NullableFilters {
    [Key: string]: Filter | null;
}

export interface FiltersSelectProps<D> {
    fields: Fields<D>;
    filters: NullableFilters;
    onFiltersChange: (filters: NullableFilters) => void;
    onFilterSave: (key: string) => void;
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<{}>;
}

export type FiltersSelectProvidedProps = 'filtersContainerComponent' | 'filtersItemComponent';

export class FiltersSelect<D> extends React.PureComponent<FiltersSelectProps<D>, never> {
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

    render() {
        return <React.Fragment>
            <button onClick={() => this.handleAdd()}>
                Add filter
            </button>
            <this.props.filtersContainerComponent>
                {Object.keys(this.props.filters).map((key) =>
                    <this.props.filtersItemComponent key={key}>
                        <FilterSelect
                            fields={this.props.fields}
                            filter={this.props.filters[key]}
                            onFilterChange={(filter) => this.handleFilterChange(key, filter)}
                            onFilterSave={() => this.props.onFilterSave(key)}
                        />
                        <button onClick={() => this.handleFilterRemove(key)}>
                            Remove
                        </button>
                    </this.props.filtersItemComponent>
                )}
            </this.props.filtersContainerComponent>
        </React.Fragment>;
    }
}
