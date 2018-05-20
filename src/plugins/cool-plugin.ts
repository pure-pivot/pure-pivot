import { ConfigurationBuilder } from '../configuration';
import { Filter } from '../filters/model';

export class MyCoolPlugin<D> {
    previous: ConfigurationBuilder<D>;

    constructor(previous: ConfigurationBuilder<D>) {
        this.previous = previous;
    }

    withFilter(filter: Filter<D>) {
        console.log('cool filter');
        this.previous.withFilter(filter);
        return this;
    }

    honk() {
        console.log('HONK');
        return this;
    }
}
