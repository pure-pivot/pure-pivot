import * as React from 'react';
import { Filters, Filter } from './filters/model';
import { TableProps, TableProvidedProps, Table } from './table/table';
import { ValueReducers, ValueReducerDescription } from './values/model';
import { Groups, Grouper } from './groups/model';
import { Selections } from './selections/model';
import { defaultPlugins } from './plugins/default-plugins';

export interface Configuration<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
    // filtersComponent: React.ComponentType<Pick<FiltersComponentProps<D>, Exclude<keyof FiltersComponentProps<D>, FiltersComponentProvidedProps>>>;
    tableComponent: React.ComponentType<Pick<TableProps<D>, Exclude<keyof TableProps<D>, TableProvidedProps>>>;
}

export interface ConfigurationBuilder<D> {
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
    tableComponent: React.ComponentType<TableProps<D>>;
    withFilters(filters: Filters<D>): this;
    withFilter(filter: Filter<D>): this;
    withValues(values: ValueReducers<D>): this;
    withValue(value: ValueReducerDescription<D>): this;
    withGroups(groups: Groups<D>): this;
    withGroup(group: Grouper<D>): this;
    withSelections(selections: Selections<D>): this;
    withSelection(selection: Grouper<D>): this;
    build(): Configuration<D>;
}

// export type CapabilityFunction<D, CB1 extends ConfigurationBuilder<D>, C extends { [Key: string]: any[] }, K extends keyof C>
//     = (...parameters: C[K]) => ExtendedConfigurationBuilder<D, CB1, C>;

// export type ExtendedConfigurationBuilder<D, CB1 extends ConfigurationBuilder<D>, C extends { [Key: string]: (...parameters: any[]) => any }>
//     = CB1 & { [Key in keyof C]: CapabilityFunction<D, CB1, C, Key> };

// interface MyCoolCapabilities {
//     honk: () => void;
// }

// type WithCapabilities<Capabilties extends { [Key: string]: (...parameters: any[]) => any }> = {};

export function createConfigurationBuilder<D>(data: D[]): ConfigurationBuilder<D> {
    const builder: ConfigurationBuilder<D> = {
        filters: [],
        groups: [],
        selections: [],
        values: [],
        tableComponent: Table,
        withFilter(filter) {
            builder.filters = [...builder.filters, filter];
            return this;
        },
        withFilters(filters) {
            builder.filters = filters;
            return this;
        },
        withValues(values: ValueReducers<D>) {
            builder.values = values;
            return this;
        },
        withValue(value: ValueReducerDescription<D>) {
            builder.values = [...builder.values, value];
            return this;
        },
        withGroups(groups: Groups<D>) {
            builder.groups = groups;
            return this;
        },
        withGroup(group: Grouper<D>) {
            builder.groups = [...builder.groups, group];
            return this;
        },
        withSelections(selections: Selections<D>) {
            builder.selections = selections;
            return this;
        },
        withSelection(selection: Grouper<D>) {
            builder.selections = [...builder.selections, selection];
            return this;
        },
        build() {
            return {
                data,
                filters: builder.filters,
                groups: builder.groups,
                selections: builder.selections,
                values: builder.values,
                tableComponent: builder.tableComponent
            };
        }
    };

    return defaultPlugins.reduce((builder, plugin) => plugin(builder), builder);
}

// export class ConfigurationBuilder<D> {
//     data: D[];
//     filters: Filters<D>;
//     groups: Groups<D>;
//     selections: Selections<D>;
//     values: ValueReducers<D>;
//     // filterComponent: React.ComponentType<FilterComponentProps<D[keyof D]>>;
//     // andFilterComponent: React.ComponentType<AndFilterComponentProps<D[keyof D]>>;
//     // notFilterComponent: React.ComponentType<NotFilterComponentProps<D[keyof D]>>;
//     // equalsFilterComponent: React.ComponentType<EqualsFilterComponentProps<D[keyof D]>>;
//     // filterDescriptionComponent: React.ComponentType<FilterDescriptionComponentProps<D, keyof D>>;
//     // filtersComponent: React.ComponentType<FiltersComponentProps<D>>;
//     tableComponent: React.ComponentType<TableProps<D>>;

//     private constructor(data: D[]) {
//         this.data = data;
//         this.filters = [];
//         this.groups = [];
//         this.selections = [];
//         this.values = [];
//         // this.filterComponent = FilterComponent;
//         // this.andFilterComponent = AndFilterComponent;
//         // this.notFilterComponent = NotFilterComponent;
//         // this.equalsFilterComponent = EqualsFilterComponent;
//         // this.filterDescriptionComponent = FilterDescriptionComponent;
//         // this.filtersComponent = FiltersComponent;
//         this.tableComponent = Table;
//     }

//     withFilter(filter: Filter<D>) {
//         this.filters = [...this.filters, filter];
//         return this;
//     }

//     withFilters(filters: Filters<D>) {
//         this.filters = filters;
//         return this;
//     }

//     // withFilter<F extends keyof D>(filter: FilterDescription<D, F>) {
//     //     this.filters = [...this.filters, filter];
//     //     return this;
//     // }

//     // withFilterComponent(filterComponent: React.ComponentType<FilterComponentProps<D[keyof D]>>) {
//     //     this.filterComponent = filterComponent;
//     //     return this;
//     // }

//     // withAndFilterComponent(andFilterComponent: React.ComponentType<AndFilterComponentProps<D[keyof D]>>) {
//     //     this.andFilterComponent = andFilterComponent;
//     //     return this;
//     // }

//     // withFilterDescriptionComponent(filterDescriptionComponent: React.ComponentType<FilterDescriptionComponentProps<D, keyof D>>) {
//     //     this.filterDescriptionComponent = filterDescriptionComponent;
//     //     return this;
//     // }

//     // withFiltersComponent(filtersComponent: React.ComponentType<FiltersComponentProps<D>>) {
//     //     this.filtersComponent = filtersComponent;
//     //     return this;
//     // }

//     withValues(values: ValueReducers<D>) {
//         this.values = values;
//         return this;
//     }

//     withValue(value: ValueReducerDescription<D>) {
//         this.values = [...this.values, value];
//         return this;
//     }

//     withGroups(groups: Groups<D>) {
//         this.groups = groups;
//         return this;
//     }

//     withGroup(group: Grouper<D>) {
//         console.log(this);
//         this.groups = [...this.groups, group];
//         return this;
//     }

//     withSelections(selections: Selections<D>) {
//         this.selections = selections;
//         return this;
//     }

//     withSelection(selection: Grouper<D>) {
//         this.selections = [...this.selections, selection];
//         return this;
//     }

//     build(): Configuration<D> {
//         // const filterComponentProvidedProps: { [Key: string]: React.ComponentType<any> } = {
//         //     andFilterComponent: this.andFilterComponent,
//         //     notFilterComponent: this.notFilterComponent,
//         //     equalsFilterComponent: this.equalsFilterComponent
//         // };

//         // const specificFilterComponentProvidedProps = {
//         //     filterComponent: providePropsComponentFactory(this.filterComponent, filterComponentProvidedProps)
//         // };

//         // for (const key of Object.keys(filterComponentProvidedProps)) {
//         //     filterComponentProvidedProps[key] = providePropsComponentFactory(filterComponentProvidedProps[key], specificFilterComponentProvidedProps);
//         // }

//         return {
//             data: this.data,
//             filters: this.filters,
//             groups: this.groups,
//             selections: this.selections,
//             values: this.values,
//             // filtersComponent: providePropsComponentFactory(this.filtersComponent, {
//             //     filterDescriptionComponent: providePropsComponentFactory(this.filterDescriptionComponent, {
//             //         filterComponent: specificFilterComponentProvidedProps.filterComponent
//             //     })
//             // }),
//             tableComponent: this.tableComponent
//         };
//     }

//     static createBuilder<D>(data: D[]) {
//         return defaultPlugins.reduce((instance, plugin) => plugin(instance), new ConfigurationBuilder(data));
//     }
// }
