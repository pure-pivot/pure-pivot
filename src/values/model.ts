export type ValueReducer<D, F extends keyof D> = (values: D[F][]) => D[F];

export interface ValueReducerDescription<D, F extends keyof D> {
    id: string;
    name: F;
    reducer: ValueReducer<D, F>;
    label: string;
}

export type ValueReducers<D> = ValueReducerDescription<D, keyof D>[];
