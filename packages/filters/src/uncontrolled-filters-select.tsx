import * as React from 'react';
import { UncontrolledFilterSelectProps, UncontrolledFilterSelectProvidedProps } from './uncontrolled-filter-select';
import { Fields, Filters, Filter } from './model';

// TODO: this module can probably be replaced by a combination of controlled version + something like https://www.npmjs.com/package/uncontrollable

export interface NullableFilters {
    [Key: string]: Filter | null;
}

export interface UncontrolledFiltersSelectProps<D> {
    fields: Fields<D>;
    defaultFilters: Filters;
    onFiltersChange: (filters: Filters) => void;
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<{}>;
    uncontrolledFilterSelectComponent: React.ComponentType<Pick<UncontrolledFilterSelectProps<D>, Exclude<keyof UncontrolledFilterSelectProps<D>, UncontrolledFilterSelectProvidedProps>>>;
}

export type UncontrolledFiltersSelectProvidedProps = 'filtersContainerComponent' | 'filtersItemComponent' | 'uncontrolledFilterSelectComponent';

export interface UncontrolledFiltersSelectState {
    filters: NullableFilters;
}

export class UncontrolledFiltersSelect<D> extends React.PureComponent<UncontrolledFiltersSelectProps<D>, UncontrolledFiltersSelectState> {
    counter: number = 0;

    state: UncontrolledFiltersSelectState = {
        filters: this.props.defaultFilters
    };

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
        this.setState({ filters: newFilters });
        this.pushNewFilters(newFilters);
    }

    handleFilterRemoveAll() {
        this.setState({ filters: { } });
        this.pushNewFilters({ });
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
            <button type="button" onClick={() => this.handleAdd()}>
                Add filter
            </button>
            <button disabled={Object.keys(this.state.filters).length === 0} onClick={() => this.handleFilterRemoveAll()}>
                Remove All
            </button>
            <this.props.filtersContainerComponent>
                {Object.keys(this.state.filters).map((key) =>
                    <this.props.filtersItemComponent key={key}>
                        <this.props.uncontrolledFilterSelectComponent
                            fields={this.props.fields}
                            defaultFilter={this.state.filters[key]}
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
