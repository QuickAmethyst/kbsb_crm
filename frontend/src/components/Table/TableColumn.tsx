import { forwardRef, TdHTMLAttributes } from 'react';

import config from '@/utils/config';
import theme from '@/utils/theme';

export type TableColumnRef = HTMLTableCellElement;
export type TableColumnProps = TdHTMLAttributes<HTMLTableCellElement> & {
  verticalAlign?: 'top' | 'bottom' | 'middle';
};

const TableColumn = forwardRef<TableColumnRef, TableColumnProps>(
  ({ children, verticalAlign, ...props }, ref) => (
    <td {...props} ref={ref}>
      {children}
      <style jsx>
        {`
          td {
            color: inherit;
            font-size: 14px;
            padding: 10px;
            background-color: ${theme.color.black[1]};
            border-bottom: solid ${theme.color.grey[2]} 1px;
            vertical-align: ${verticalAlign || 'middle'};
          }
        `}
      </style>
    </td>
  )
);

if (config.isDev) {
  TableColumn.displayName = 'TableColumn';
}

export default TableColumn;
