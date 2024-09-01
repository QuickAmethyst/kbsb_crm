import { forwardRef, HTMLAttributes } from 'react';

import classNames from 'classnames';

import config from '@/utils/config';
import theme from '@/utils/theme';

export type TableRowRef = HTMLTableRowElement;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  selected?: boolean;
  button?: boolean;
};

const TableRow = forwardRef<TableRowRef, TableRowProps>(
  ({ className: classNameProp, button, selected, children, ...props }, ref) => {
    const className = classNames({ button, selected }, classNameProp);

    return (
      <tr {...props} ref={ref} className={className} role={button ? 'button' : undefined}>
        {children}

        <style jsx>
          {`
            tr {
              transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            }

            tr.button {
              cursor: pointer;
            }

            tr.selected {
              background-color: ${theme.color.violet[1]};
            }

            tr.button:hover {
              background-color: ${theme.color.green[1]};
            }

            tr.button.selected:hover {
              background-color: ${theme.color.violet[2]};
            }
          `}
        </style>
      </tr>
    );
  }
);

if (config.isDev) {
  TableRow.displayName = 'TableRow';
}

export default TableRow;
