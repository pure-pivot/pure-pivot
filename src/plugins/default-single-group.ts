import { ConfigurationBuilder, Configuration } from '../configuration';

export function defaultSingleGroup<D>(configurationBuilder: ConfigurationBuilder<D>): ConfigurationBuilder<D> {
    return Object.assign({}, configurationBuilder, {
        build: () => {
            const result = configurationBuilder.build();

            if (result.groups.length <= 0) {
                result.groups = [{
                    id: 'pure-pivot-default-group',
                    label: 'All',
                    grouper: (data) => {
                        const dataIndices: number[] = [];

                        for (const row of data) {
                            dataIndices.push(0);
                        }

                        return {
                            groupIndices: dataIndices,
                            groupLabels: ['all']
                        };
                    }
                }];
            }

            return result;
        }
    });
}
