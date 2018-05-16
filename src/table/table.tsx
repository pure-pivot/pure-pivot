import * as React from 'react';
import { Filters } from '../filters/model';
import { applyFiltersToAll } from '../filters/apply-filter';
import { Formats } from '../formats/model';
import { ValueReducers } from '../values/model';
import { Groups } from '../groups/model';
import { applyGroups } from '../groups/apply-groups';
import { extractLabels } from '../groups/extra-labels';

export interface TableProps<D> {
    data: D[];
    filters: Filters<D>;
    groups: Groups<D>;
    values: ValueReducers<D>;
    formats: Formats<D>;
}

export type TableProvidedProps = never;

type Grouping<T> = T[] | NestedGrouping<T>;

interface NestedGrouping<T> extends Array<Grouping<T>> { }

export class Table<D> extends React.Component<TableProps<D>, never> {
    render() {
        const filteredData = applyFiltersToAll(this.props.filters, this.props.data);
        const groupedData = applyGroups(this.props.groups, filteredData);

        // TODO: it probably makes more sense only to show the available labels per sub-grouping
        // e.g.: if there are no "POST" requests to "/ldap/verify", then don't show that sub-group.
        const extractedLabels = extractLabels(this.props.groups.length, groupedData);

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
                    {this.props.groups.map((grouper) =>
                        <tr key={grouper.id}>
                            <th>{grouper.label}</th>
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
                {JSON.stringify(labels, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(extractedLabels, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(groupedData, null, 2)}
            </pre>
        </React.Fragment>;
    }
}
