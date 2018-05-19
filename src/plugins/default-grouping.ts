import { ConfigurationBuilder } from '../configuration';

export const defaultGrouping = <CB1 extends ConfigurationBuilder<any>>(configurationBuilder: CB1): CB1 => {
    const builder = Object.assign({}, configurationBuilder, {
        build: () => {
            const result = configurationBuilder.build();
            console.log(result);
            return result;
        }
    });

    return builder;
};
