import * as React from 'react';

export interface PaginationProps {
    offset: number;
    limit: number;
    onOffsetChange: (offset: number) => void;
}

export class Pagination extends React.Component<PaginationProps, never> {
    render() {
        return 'Pagination';
    }
}
