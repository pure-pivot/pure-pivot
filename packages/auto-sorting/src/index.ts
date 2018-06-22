import { ConfigurationBuilder } from '@pure-pivot/core/lib/es6/configuration';
import { DataColumnDescriptor } from '@pure-pivot/core/lib/es6/table/model';
import { SortingGroup } from '@pure-pivot/core/lib/es6/sorting/model';
import { AutoSortingConfigurationBuilder, SortedValueReducers, SortedValueReducerDescription, SortingDescriptor } from './model';

export function autoSorting<D>(configurationBuilder: ConfigurationBuilder<D>): AutoSortingConfigurationBuilder<D> {
    const { values, withValue, withValues, ...other } = configurationBuilder;

    const builder: AutoSortingConfigurationBuilder<D> = {
        ...other,
        values: [],
        autoSorters: [],
        withAutoSorter(sorter: SortingDescriptor) {
            builder.autoSorters = [...builder.autoSorters, sorter];
            return this;
        },
        withAutoSorters(sorters: SortingDescriptor[]) {
            builder.autoSorters = sorters;
            return this;
        },
        withValues(values: SortedValueReducers<D>) {
            builder.values = values;
            return this;
        },
        withValue<C, T>(this: C, value: SortedValueReducerDescription<D, T>) {
            builder.values = [...builder.values, value];
            return this;
        },
        build() {
            const configuration = configurationBuilder.build();
            configuration.values = builder.values;
            configuration.sorting = [
                ...configuration.sorting,
                ...builder.autoSorters.map((sorter) => {
                    const valueDescription = builder.values.find((valueDescription) => valueDescription.id === sorter.valueId);
                    const multiplier = sorter.order === 'ascending' ? 1 : -1;
                    return (dataColumns: DataColumnDescriptor<D, {}>[]) => {
                        const cellIndex = dataColumns.findIndex((column) =>
                            column.valueDescription.id === sorter.valueId
                            && column.groupDescriptors.every((group, index) =>
                                sorter.groupDescriptors[index] !== undefined
                                && group.groupId === sorter.groupDescriptors[index].groupId
                                && group.groupIndex === sorter.groupDescriptors[index].groupIndex
                            )
                        );

                        if (cellIndex < 0 || valueDescription === undefined || sorter.order === null) {
                            return () => 0;
                        } else {
                            return (group1: SortingGroup<D>, group2: SortingGroup<D>) =>
                                multiplier * valueDescription.comparator(group1.cells[cellIndex].value, group2.cells[cellIndex].value);
                        }
                    };
                })
            ];

            return configuration;
        }
    };

    return builder;
}
