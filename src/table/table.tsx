import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { applyGroups, Grouping } from '../groups/apply-groups';
import { countLabels } from '../groups/count-labels';
import { Selections } from '../selections/model';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    selections: Selections<D>;
    values: ValueReducers<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    // renderGroupingRecursive(groupedData: Grouping<D>, boxedIndex: { index: number }): any {
    //     if (groupedData.type === 'nested') {
    //         return groupedData.data.map((nestedGrouping) => this.renderGroupingRecursive(nestedGrouping.data, boxedIndex));
    //     } else {
    //         return <td key={boxedIndex.index++}>
    //             {groupedData.data.length}
    //         </td>;
    //     }
    // }

    // recursiveFillValues(rowGrouping: Grouping<D>, columnGrouping: Grouping<D>, values: string[][]) {

    // }

    // recursiveGroupIndices(data: D[], groups: Groups<D>, dataGroupIndices: number[], groupLabels: string[]) {
    //     const [head, ...tail] = groups;
    //     for (const group of head.grouper(data)) {
    //         group.
    //     }
    // }

    render() {
        const start = window.performance.now();
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        console.log(`${window.performance.now() - start} ms`);
        const groups = applyGroups(this.props.groups, filteredData);
        console.log(`${window.performance.now() - start} ms`);
        const selections = applyGroups(this.props.selections, filteredData);
        console.log(`${window.performance.now() - start} ms`);

        // const selectionData = applyGroups(this.props.selections, filteredData);
        // const selectionLabelsCounts = countLabels(selectionData);
        // const groupedData = applyGroups(this.props.groups, filteredData);
        // const groupedLabelsCounts = countLabels(groupedData);

        // const rowsCount = selectionLabelsCounts[selectionLabelsCounts.length - 1].length;
        // const columnsCount = groupedLabelsCounts[groupedLabelsCounts.length - 1].length;
        // const values: string[][] = [];
        // for (let i = 0; i < rowsCount; i++) {
        //     values[i] = [];
        //     for (let j = 0; j < columnsCount; j++) {
        //         values[i][j] = '';
        //     }
        // }

        return <React.Fragment>
            <table>
                <thead>
                    {this.props.groups.map((grouper, index) =>
                        <tr key={grouper.id}>
                            <th>{grouper.label}</th>
                            {/* {groupedLabelsCounts[index].map((labelCount, index) => <th key={index} colSpan={labelCount.count}>{labelCount.label}</th>)} */}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {/* <tr>
                        <td>Values</td>
                        {this.renderGroupingRecursive(groupedData, { index: 0 })}
                    </tr> */}
                </tbody>
            </table>
            <pre>
                {JSON.stringify(groups, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(selections, null, 2)}
            </pre>
            {/* <pre>
                {JSON.stringify(selectionLabelsCounts, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(selectionData, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(groupedLabelsCounts, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(groupedData, null, 2)}
            </pre> */}
        </React.Fragment>;
    }
}
