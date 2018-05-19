// TODO: consider return type of React.ReactNode instead of string?
export type ValueReducer<D> = (values: D[]) => string;

export interface ValueReducerDescription<D> {
    id: string;
    label: string;
    reducer: ValueReducer<D>;
}

export type ValueReducers<D> = ValueReducerDescription<D>[];
