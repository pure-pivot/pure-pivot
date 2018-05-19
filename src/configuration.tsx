import * as React from 'react';
import { Filters, FilterDescription } from './filters/model';
import { FiltersComponentProps, FiltersComponent, FiltersComponentProvidedProps } from './filters/filters-component';
import { FilterDescriptionComponentProps, FilterDescriptionComponent } from './filters/filter-description-component';
import { FilterComponentProps, FilterComponent } from './filters/components/filter-component';
import { AndFilterComponentProps, AndFilterComponent } from './filters/components/and-filter-component';
import { NotFilterComponent, NotFilterComponentProps } from './filters/components/not-filter-components';
import { EqualsFilterComponent, EqualsFilterComponentProps } from './filters/components/equals-filter-component';
import { TableProps, TableProvidedProps, Table } from './table/table';
import { ValueReducers, ValueReducerDescription } from './values/model';
import { Groups, Grouper } from './groups/model';
import { inferGroups } from './groups/infer-grouper';
import { Selections } from './selections/model';
import { inferSelections } from './selections/infer-selections';
import { inferValues } from './values/infer-values';

export interface Configuration<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
    filtersComponent: React.ComponentType<Pick<FiltersComponentProps<D>, Exclude<keyof FiltersComponentProps<D>, FiltersComponentProvidedProps>>>;
    tableComponent: React.ComponentType<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>>;
}

export function providePropsComponentFactory<P, U>(Component: React.ComponentType<P>, providedProps: U): React.ComponentType<Pick<P, Exclude<keyof P, keyof U>>> {
    return (props: Pick<P, Exclude<keyof P, keyof U>>) => <Component {...providedProps} {...props} />;
}

export class ConfigurationBuilder<D> {
    private data: D[];
    private filters: Filters<D>;
    private groups: Groups<D>;
    private selections: Selections<D>;
    private values: ValueReducers<D>;
    private filterComponent: React.ComponentType<FilterComponentProps<D[keyof D]>>;
    private andFilterComponent: React.ComponentType<AndFilterComponentProps<D[keyof D]>>;
    private notFilterComponent: React.ComponentType<NotFilterComponentProps<D[keyof D]>>;
    private equalsFilterComponent: React.ComponentType<EqualsFilterComponentProps<D[keyof D]>>;
    private filterDescriptionComponent: React.ComponentType<FilterDescriptionComponentProps<D, keyof D>>;
    private filtersComponent: React.ComponentType<FiltersComponentProps<D>>;
    private tableComponent: React.ComponentType<TableProps<D>>;

    constructor(data: D[]) {
        this.data = data;
        this.filters = [];
        this.groups = inferGroups();
        this.selections = inferSelections();
        this.values = inferValues();
        this.filterComponent = FilterComponent;
        this.andFilterComponent = AndFilterComponent;
        this.notFilterComponent = NotFilterComponent;
        this.equalsFilterComponent = EqualsFilterComponent;
        this.filterDescriptionComponent = FilterDescriptionComponent;
        this.filtersComponent = FiltersComponent;
        this.tableComponent = Table;
    }

    withFilters(filters: Filters<D>) {
        this.filters = filters;
        return this;
    }

    withFilter<F extends keyof D>(filter: FilterDescription<D, F>) {
        this.filters = [...this.filters, filter];
        return this;
    }

    withFilterComponent(filterComponent: React.ComponentType<FilterComponentProps<D[keyof D]>>) {
        this.filterComponent = filterComponent;
        return this;
    }

    withAndFilterComponent(andFilterComponent: React.ComponentType<AndFilterComponentProps<D[keyof D]>>) {
        this.andFilterComponent = andFilterComponent;
        return this;
    }

    withFilterDescriptionComponent(filterDescriptionComponent: React.ComponentType<FilterDescriptionComponentProps<D, keyof D>>) {
        this.filterDescriptionComponent = filterDescriptionComponent;
        return this;
    }

    withFiltersComponent(filtersComponent: React.ComponentType<FiltersComponentProps<D>>) {
        this.filtersComponent = filtersComponent;
        return this;
    }

    withValues(values: ValueReducers<D>) {
        this.values = values;
        return this;
    }

    withValue(value: ValueReducerDescription<D>) {
        this.values = [...this.values, value];
        return this;
    }

    withGroups(groups: Groups<D>) {
        this.groups = groups;
        return this;
    }

    withGroup(group: Grouper<D>) {
        this.groups = [...this.groups, group];
        return this;
    }

    withSelections(selections: Selections<D>) {
        this.selections = selections;
        return this;
    }

    withSelection(selection: Grouper<D>) {
        this.selections = [...this.selections, selection];
        return this;
    }

    build(): Configuration<D> {
        const filterComponentProvidedProps: { [Key: string]: React.ComponentType<any> } = {
            andFilterComponent: this.andFilterComponent,
            notFilterComponent: this.notFilterComponent,
            equalsFilterComponent: this.equalsFilterComponent
        };

        const specificFilterComponentProvidedProps = {
            filterComponent: providePropsComponentFactory(this.filterComponent, filterComponentProvidedProps)
        };

        for (const key of Object.keys(filterComponentProvidedProps)) {
            filterComponentProvidedProps[key] = providePropsComponentFactory(filterComponentProvidedProps[key], specificFilterComponentProvidedProps);
        }

        return {
            data: this.data,
            filters: this.filters,
            groups: this.groups,
            selections: this.selections,
            values: this.values,
            filtersComponent: providePropsComponentFactory(this.filtersComponent, {
                filterDescriptionComponent: providePropsComponentFactory(this.filterDescriptionComponent, {
                    filterComponent: specificFilterComponentProvidedProps.filterComponent
                })
            }),
            tableComponent: this.tableComponent
        };
    }
}
