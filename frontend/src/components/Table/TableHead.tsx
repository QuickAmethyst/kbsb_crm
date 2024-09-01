import { forwardRef, HTMLAttributes } from 'react';

import config from '@/utils/config';

export type TableHeaderRef = HTMLTableSectionElement;
export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHead = forwardRef<TableHeaderRef, TableHeadProps>(({ children, ...props }, ref) => (
  <thead {...props} ref={ref}>
    {children}
    <style jsx>
      {`
        thead {
          display: table-header-group;
        }
      `}
    </style>
  </thead>
));

if (config.isDev) {
  TableHead.displayName = 'TableHead';
}

export default TableHead;
