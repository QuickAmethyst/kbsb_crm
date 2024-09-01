import { ColHTMLAttributes } from 'react';

export type TableColProps = ColHTMLAttributes<HTMLElement>;

export default function TableCol(props: TableColProps) {
  return <col {...props} />;
}
