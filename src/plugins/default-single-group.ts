import { ConfigurationBuilder } from '../configuration';

export function defaultSingleGroup<D>(configurationBuilder: ConfigurationBuilder<D>): ConfigurationBuilder<D> {
    return {
        ...configurationBuilder,
        build() {
            const result = configurationBuilder.build();

            if (result.groups.length <= 0) {
                result.groups = [{
                    id: 'pure-pivot-default-group',
                    label: 'All',
                    grouper: (data) => {
                        const dataIndices: number[] = data.map(() => 0);

                        return {
                            groupIndices: dataIndices,
                            groupLabels: ['all']
                        };
                    }
                }];
            }

            return result;
        }
    };
}
