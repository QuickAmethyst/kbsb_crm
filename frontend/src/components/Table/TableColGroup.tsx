import { ColgroupHTMLAttributes } from 'react';

import TableCol from './TableCol';

export type TableColGroupProps = ColgroupHTMLAttributes<HTMLElement>;

export default function TableColGroup(props: TableColGroupProps) {
  return <colgroup {...props} />;
}

TableColGroup.Col = TableCol;
