import { TableConfigurationBuilder, TableConfiguration } from '../../../table/configuration';
import { TableHeadGroupCellProps, TableHeadGroupCell } from './table-head-group-cell';
import { TableHeadValueCellProps, TableHeadValueCell } from './table-head-value-cell';

export interface StylableCellsTableConfigurationBuilder<D> extends TableConfigurationBuilder<D> {
    tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>;
    tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>;
    withTableHeadGroupCellComponent<C>(this: C, tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>): C;
    withTableHeadValueCellComponent<C>(this: C, tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>): C;
}

export const stylable = <D>(tableConfigurationBuilder: TableConfigurationBuilder<D>): StylableCellsTableConfigurationBuilder<D> => {
    const builder: StylableCellsTableConfigurationBuilder<D> = Object.assign({}, tableConfigurationBuilder, {
        tableHeadGroupCellComponent: TableHeadGroupCell,
        tableHeadValueCellComponent: TableHeadValueCell,
        withTableHeadGroupCellComponent<C>(this: C, tableHeadGroupCellComponent: React.ComponentType<TableHeadGroupCellProps<D>>) {
            builder.tableHeadGroupCellComponent = tableHeadGroupCellComponent;
            return this;
        },
        withTableHeadValueCellComponent<C>(this: C, tableHeadValueCellComponent: React.ComponentType<TableHeadValueCellProps<D>>) {
            builder.tableHeadValueCellComponent = tableHeadValueCellComponent;
            return this;
        },
        build() {
            tableConfigurationBuilder.withTableHeadGroupCellComponent(this.tableHeadGroupCellComponent);
            tableConfigurationBuilder.withTableHeadValueCellComponent(this.tableHeadValueCellComponent);
            return tableConfigurationBuilder.build();
        }
    });

    return builder;
};
