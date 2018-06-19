import { Filters, Filter } from './filters/model';
import { ValueReducers, ValueReducerDescription } from './values/model';
import { Groups, Grouper } from './groups/model';
import { Selections } from './selections/model';
import { defaultConfigurationPlugins } from './plugins/default-plugins';
import { Sorter, Sorting } from './sorting/model';
import { generateTableDescription } from './generate-table-description';
import { TableDescription } from './table/model';

export interface Configuration<D> {
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Sorting<D>;
    values: ValueReducers<D>;
}

export interface ConfigurationBuilder<D> {
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    sorting: Sorting<D>;
    values: ValueReducers<D>;
    generateTableDescription: (configuration: Configuration<D>) => (data: D[]) => TableDescription<D>;
    withFilters<C>(this: C, filters: Filters<D>): C;
    withFilter<C>(this: C, filter: Filter<D>): C;
    withValues<C>(this: C, values: ValueReducers<D>): C;
    withValue<C, T>(this: C, value: ValueReducerDescription<D, T>): C;
    withGroups<C>(this: C, groups: Groups<D>): C;
    withGroup<C>(this: C, group: Grouper<D>): C;
    withSelections<C>(this: C, selections: Selections<D>): C;
    withSelection<C>(this: C, selection: Grouper<D>): C;
    withSorters<C>(this: C, sorters: Sorting<D>): C;
    withSorter<C>(this: C, sorter: Sorter<D>): C;
    withPlugin<C>(plugin: (configurationBuilder: ConfigurationBuilder<D>) => C): C;
    build(): Configuration<D>;
}

export function createConfigurationBuilder<D>(plugins: ((configurationBuilder: ConfigurationBuilder<D>) => ConfigurationBuilder<D>)[] = defaultConfigurationPlugins): ConfigurationBuilder<D> {
    const builder: ConfigurationBuilder<D> = {
        filters: [],
        groups: [],
        selections: [],
        sorting: [],
        values: [],
        generateTableDescription,
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
        withValue<C, T>(this: C, value: ValueReducerDescription<D, T>) {
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
        withSorters(sorters: Sorting<D>) {
            builder.sorting = sorters;
            return this;
        },
        withSorter(sorter: Sorter<D>) {
            builder.sorting = [...builder.sorting, sorter];
            return this;
        },
        withPlugin<C>(plugin: (configurationBuilder: ConfigurationBuilder<D>) => C) {
            return plugin(this);
        },
        build() {
            return {
                filters: builder.filters,
                groups: builder.groups,
                selections: builder.selections,
                sorting: builder.sorting,
                values: builder.values
            };
        }
    };

    return plugins.reduce((builder, plugin) => plugin(builder), builder);
}
