import { ForwardedRef, TableHTMLAttributes, forwardRef } from 'react';

import theme from '@/utils/theme';

import TableBody from './TableBody';
import TableColGroup from './TableColGroup';
import TableColumn from './TableColumn';
import TableContainer from './TableContainer';
import TableControl from './TableControl';
import TableHead from './TableHead';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { elevationCss } from '../Paper';

export type TableRef = HTMLTableElement;
export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  stickyHeader?: boolean;
};

function InnerTable({ children, stickyHeader, ...props }: TableProps, ref: ForwardedRef<TableRef>) {
  return (
    <TableControl stickyHeader={stickyHeader}>
      <table {...props} ref={ref}>
        {children}
        <style jsx>
          {`
            table {
              width: 100%;
              display: table;
              box-shadow: ${elevationCss[1]};
              border-radius: 4px;
              border-spacing: 0px;
              background-color: ${theme.color.black[1]};
              color: ${theme.color.grey[6]};
            }
          `}
        </style>
      </table>
    </TableControl>
  );
}

const Table = forwardRef(InnerTable) as unknown as typeof InnerTable & {
  Container: typeof TableContainer;
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Col: typeof TableColumn;
  ColGroup: typeof TableColGroup;
};

Table.Container = TableContainer;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Col = TableColumn;
Table.ColGroup = TableColGroup;

export default Table;
