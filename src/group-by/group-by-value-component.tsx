import * as React from 'react';
import { GroupByValue, GroupByDescription } from './model';
import { GroupByComponentProps, GroupByComponentProvidedProps } from './group-by-components/group-by-component';

export interface GroupByValueComponentProps<D, F extends keyof D> {
    groupByValue: GroupByValue<D, F>;
    groupByComponent: React.ComponentType<Pick<GroupByComponentProps<D[F]>, Exclude<keyof GroupByComponentProps<D[F]>, GroupByComponentProvidedProps>>>;
}

export type GroupByValueComponentProvidedProps = 'groupByComponent';

export class GroupByValueComponent<D, F extends keyof D> extends React.Component<GroupByValueComponentProps<D, F>, never> {
    renderIdentity() {
        return <React.Fragment>
            Identity
        </React.Fragment>;
    }

    renderGroupByDescription(groupByDescription: GroupByDescription<D, F>) {
        return <React.Fragment>
            <div>On field: {groupByDescription.name}</div>
            <div><this.props.groupByComponent groupBy={groupByDescription.groupBy} /></div>
        </React.Fragment>;
    }

    render() {
        return <div>
            {this.props.groupByValue.type === 'identity'
                ? this.renderIdentity()
                : this.renderGroupByDescription(this.props.groupByValue)
            }
        </div>;
    }
}
