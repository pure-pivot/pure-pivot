export interface VirtualScrollingState {
    rowHeight: number;
    overscan: number;
}

export interface Subscription {
    unsubscribe: () => void;
}
