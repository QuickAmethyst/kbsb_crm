import { PropsWithChildren, createContext, useContext, useMemo } from 'react';

type TableControlValues = { stickyHeader?: boolean };
type TableControlProps = PropsWithChildren<Pick<TableControlValues, 'stickyHeader'>>;

const Context = createContext<TableControlValues>({ stickyHeader: false });

export function useTableControl() {
  return useContext(Context);
}

export default function TableControl({
  stickyHeader = false,
  children,
  ...props
}: TableControlProps) {
  const value = useMemo(() => ({ stickyHeader }), [stickyHeader]);

  return (
    <Context.Provider {...props} value={value}>
      {children}
    </Context.Provider>
  );
}
