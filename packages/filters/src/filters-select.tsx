import * as React from 'react';
import { FilterSelect } from './filter-select';
import { Fields, Filters, Filter } from './model';

export interface NullableFilters {
    [Key: string]: Filter | null;
}

export interface FiltersSelectProps<D> {
    fields: Fields<D>;
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<{}>;
}

export type FiltersSelectProvidedProps = 'filtersContainerComponent' | 'filtersItemComponent';

export interface FiltersSelectState {
    filters: NullableFilters;
}

export class FiltersSelect<D> extends React.PureComponent<FiltersSelectProps<D>, FiltersSelectState> {
    counter: number = 0;

    state: FiltersSelectState = {
        filters: this.props.filters
    };

    componentWillReceiveProps(nextProps: FiltersSelectProps<D>) {
        if (this.props.filters !== nextProps.filters) {
            this.setState({
                filters: {
                    ...this.state.filters,
                    ...nextProps.filters
                }
            });
        }
    }

    handleAdd() {
        while (this.counter.toString() in this.state.filters) {
            this.counter += 1;
        }
        this.setState({ filters: { ...this.state.filters, [this.counter.toString()]: null } });
    }

    handleFilterChange(key: string, filter: Filter) {
        const newFilters: NullableFilters = { ...this.state.filters };
        newFilters[key] = filter;
        this.setState({ filters: newFilters });
        this.pushNewFilters(newFilters);
    }

    handleFilterRemove(key: string) {
        const newFilters: NullableFilters = { ...this.state.filters };
        delete newFilters[key];
        this.setState({ filters: newFilters }, () => {
            this.pushNewFilters(newFilters);
        });
    }

    pushNewFilters(newFilters: NullableFilters) {
        const filters: Filters = {};
        for (const key of Object.keys(newFilters)) {
            const filter = newFilters[key];
            if (filter !== null) {
                filters[key] = filter;
            }
        }
        this.props.onFiltersChange(filters);
    }

    render() {
        return <React.Fragment>
            <button onClick={() => this.handleAdd()}>
                Add filter
            </button>
            <this.props.filtersContainerComponent>
                {Object.keys(this.state.filters).map((key) =>
                    <this.props.filtersItemComponent key={key}>
                        <FilterSelect
                            fields={this.props.fields}
                            defaultFilter={this.state.filters[key]}
                            onFilterChange={(filter) => this.handleFilterChange(key, filter)}
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
