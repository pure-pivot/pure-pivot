import * as React from 'react';
import { FilterSelect } from './uncontrolled-filter-select';
import { Fields, Filters, Filter } from './model';

// TODO: this module can probably be replaced by a combination of controlled version + something like https://www.npmjs.com/package/uncontrollable

export interface NullableFilters {
    [Key: string]: Filter | null;
}

export interface FiltersSelectProps<D> {
    fields: Fields<D>;
    defaultFilters: Filters;
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
        filters: this.props.defaultFilters
    };

    handleAdd() {
        while (this.counter.toString() in this.state.filters) {
            this.counter += 1;
        }
        this.setState({ filters: { ...this.state.filters, [this.counter.toString()]: null } });
    }

    handleRemoveAll() {
        this.setState({ filters: { }});
        this.pushNewFilters({ });
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
        this.setState({ filters: newFilters });
        this.pushNewFilters(newFilters);
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
            <button disabled={Object.keys(this.state.filters).length === 0} onClick={() => this.handleRemoveAll()}>
                Remove all
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
