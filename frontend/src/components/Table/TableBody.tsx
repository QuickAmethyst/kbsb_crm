import { ForwardedRef, forwardRef, HTMLAttributes } from 'react';

export type TableBodyRef = HTMLTableSectionElement;
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

function TableBody({ children, ...props }: TableBodyProps, ref: ForwardedRef<TableBodyRef>) {
  return (
    <tbody {...props} ref={ref}>
      {children}

      <style jsx>
        {`
          tbody > :global(tr:last-child) > :global(td) {
            border-bottom: none;
          }
        `}
      </style>
    </tbody>
  );
}

export default forwardRef(TableBody);
