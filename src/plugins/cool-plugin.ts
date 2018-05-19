import { IConfigurationBuilder, ConfigurationBuilder, Plugin } from '../configuration';
import { FilterDescription } from '../filters/model';

export class LogFilterPlugin<D> extends ConfigurationBuilder<D> {
    withFilter<F extends keyof D>(filter: FilterDescription<D, F>) {
        console.log(filter);
        return super.withFilter(filter);
    }

    withCoolFeature() {
        console.log('It is really cool');
    }
}

function plugin<D, CB extends ConfigurationBuilder<D>>(cb: CB): CB & LogFilterPlugin<D> {
    return cb;
}
