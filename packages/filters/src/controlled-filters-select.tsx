import * as React from 'react';
import { ControlledFilterSelectProps, ControlledFilterSelectProvidedProps } from './controlled-filter-select';
import { Fields, Filter } from './model';
import { AddFilterButtonProps } from './button-components/add-filter';
import { RemoveFilterButtonProps } from './button-components/remove-filter';
import { RemoveAllButtonProps } from './button-components/remove-all';
import { FiltersItemComponentProps, FiltersItemComponentProvidedProps } from './filters-item-component';

export interface NullableFilters {
    [Key: string]: Filter | null;
}

export interface ControlledFiltersSelectProps<D> {
    fields: Fields<D>;
    filters: NullableFilters;
    onFiltersChange: (filters: NullableFilters) => void;
    filtersContainerComponent: React.ComponentType<{}>;
    filtersItemComponent: React.ComponentType<Pick<FiltersItemComponentProps, Exclude<keyof FiltersItemComponentProps, FiltersItemComponentProvidedProps>>>;
    controlledFilterSelectComponent: React.ComponentType<Pick<ControlledFilterSelectProps<D>, Exclude<keyof ControlledFilterSelectProps<D>, ControlledFilterSelectProvidedProps>>>;
    addFilterButtonComponent: React.ComponentType<AddFilterButtonProps>;
    removeAllButtonComponent: React.ComponentType<RemoveAllButtonProps>;
}

export type ControlledFiltersSelectProvidedProps = 'filtersContainerComponent' | 'filtersItemComponent' | 'controlledFilterSelectComponent' | 'addFilterButtonComponent' | 'removeFilterButtonComponent' | 'removeAllButtonComponent';

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
            <this.props.addFilterButtonComponent onClick={() => this.handleAdd()} />
            <this.props.removeAllButtonComponent disabled={Object.keys(this.props.filters).length === 0} onClick={() => this.handleFilterRemoveAll()} />
            <this.props.filtersContainerComponent>
                {Object.keys(this.props.filters).map((key) =>
                    <this.props.filtersItemComponent key={key} onFilterRemove={() => this.handleFilterRemove(key)}>
                        <this.props.controlledFilterSelectComponent
                            fields={this.props.fields}
                            filter={this.props.filters[key]}
                            onFilterChange={(filter) => this.handleFilterChange(key, filter)}
                        />
                    </this.props.filtersItemComponent>
                )}
            </this.props.filtersContainerComponent>
        </React.Fragment>;
    }
}
