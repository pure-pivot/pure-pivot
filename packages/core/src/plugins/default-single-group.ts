import { ConfigurationBuilder } from '../configuration';
import { Grouper } from '../groups/model';

export const singleGroup: Grouper<{}> = {
    id: 'pure-pivot-default-group',
    label: 'All',
    grouper: (data) => {
        const dataIndices: number[] = data.map(() => 0);

        return {
            groupIndices: dataIndices,
            groupLabels: ['all']
        };
    }
};

export function defaultSingleGroup<D>(configurationBuilder: ConfigurationBuilder<D>): ConfigurationBuilder<D> {
    return {
        ...configurationBuilder,
        build() {
            const result = configurationBuilder.build();

            if (result.groups.length <= 0) {
                result.groups = [singleGroup];
            }

            return result;
        }
    };
}
