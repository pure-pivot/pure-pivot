import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { GroupByValue } from '../group-by/model';
import { applyGroupByValue } from '../group-by/apply-group-by';
import { Aggregates } from '../values/model';
import { applyAggregate } from '../values/apply-aggregate';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groupByValue: GroupByValue<D, keyof D>;
    values: Aggregates<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    render() {
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        const groupedData = applyGroupByValue(this.props.groupByValue, filteredData);
        const singlePartition = groupedData.length <= 1;

        const labeledGroups = groupedData.map((group) => {
            return this.props.values.map((aggregateDescription) => {
                return {
                    id: aggregateDescription.id,
                    name: `${aggregateDescription.name} (${aggregateDescription.aggregate.type})`,
                    aggregate: applyAggregate(aggregateDescription.aggregate, group.map((row) => row[aggregateDescription.name]))
                };
            });
        });

        return <pre>
            {JSON.stringify(labeledGroups, null, 2)}
        </pre>;

        // return <table>
        //     <thead>
        //     </thead>
        // </table>;
    }
}
