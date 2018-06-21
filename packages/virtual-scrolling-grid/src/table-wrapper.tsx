import * as React from 'react';

export function TableWrapper(props: React.AllHTMLAttributes<HTMLDivElement>) {
    const { tabIndex, style, ...other } = props;

    return <div
        tabIndex={tabIndex || 0}
        style={{ border: '1px solid black', height: 500, ...style, position: 'relative', overflowX: 'visible', overflowY: 'auto' } as React.CSSProperties}
        {...other}
    />;
}
