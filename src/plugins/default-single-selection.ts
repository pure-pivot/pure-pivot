import { ConfigurationBuilder, Configuration } from '../configuration';

export function defaultSingleSelection<D>(configurationBuilder: ConfigurationBuilder<D>) {
    return Object.assign({}, configurationBuilder, {
        build: () => {
            const result = configurationBuilder.build();

            if (result.selections.length <= 0) {
                result.selections = [{
                    id: 'pure-pivot-default-selection',
                    label: 'Identity',
                    grouper: (data) => {
                        const dataIndices: number[] = [];

                        for (let i = 0; i < data.length; i++) {
                            dataIndices.push(i);
                        }

                        return {
                            groupIndices: dataIndices,
                            groupLabels: dataIndices.map((index) => (index + 1).toString())
                        };
                    }
                }];
            }

            return result;
        }
    });
}
