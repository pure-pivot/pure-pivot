import * as React from 'react';

export type ValueReducer<D, T> = (values: D[]) => T;

export type ValueRenderer<T> = (value: T) => React.ReactNode;

export interface ValueReducerDescription<D, T> {
    id: string;
    label: string;
    reducer: ValueReducer<D, T>;
    renderer: ValueRenderer<T>;
}

export type ValueReducers<D> = ValueReducerDescription<D, {}>[];
