import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { applyGroups, Grouping } from '../groups/apply-groups';
import { extractLabels, countLabels } from '../groups/extract-labels';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    values: ValueReducers<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

export class Table<D> extends React.Component<TableProps<D>, never> {
    // renderGroupingLabelsRecursive(grouping: Grouping<D>): React.ReactNode[][] {
    //     if (grouping.type === 'nested') {
    //         grouping.data.map((nestedGrouping) => {
    //             this.renderGroupingLabelsRecursive(nestedGrouping.data);

    //             <th>{nestedGrouping.label}</th>;
    //         });
    //     } else {
    //         return [];
    //     }
    // }

    render() {
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        const groupedData = applyGroups(this.props.groups, filteredData);

        // TODO: it probably makes more sense only to show the available labels per sub-grouping
        // e.g.: if there are no "POST" requests to "/ldap/verify", then don't show that sub-group.
        const extractedLabels = extractLabels(this.props.groups.length, groupedData);

        const labelsCounted = countLabels(groupedData);

        const labels: { id: string, label: string }[] = this.props.values.map((valueDescription) => {
            return {
                id: valueDescription.id,
                label: valueDescription.label
            };
        });

        if (groupedData.type === 'leaf') {
            // groupedData.data
        }

        return <React.Fragment>
            <table>
                <thead>
                    {this.props.groups.map((grouper, index) =>
                        <tr key={grouper.id}>
                            <th>{grouper.label}</th>
                            {labelsCounted[index].map((labelCount, index) => <th key={index} colSpan={labelCount.count}>{labelCount.label}</th>)}
                        </tr>
                    )}
                </thead>
                {/* <tbody>
                    {labels.map((label, labelIndex) => {
                        return <tr key={label.id}>
                            <td>{label.label}</td>
                            {labeledGroups.map((group, groupIndex) => {
                                return <td key={groupIndex}>{group.label}</td>;
                            })}
                        </tr>;
                    })}
                </tbody> */}
            </table>
            <pre>
                {JSON.stringify(groupedData, null, 2)}
            </pre>
        </React.Fragment>;
    }
}
