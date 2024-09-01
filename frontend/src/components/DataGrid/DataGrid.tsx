import {
  ComponentType,
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  HTMLAttributes,
  Key,
  PropsWithChildren,
  ReactHTML,
  ReactNode,
  useRef,
} from 'react';

import classNames from 'classnames';
import get from 'lodash.get';

import Table from '@/components/Table';

import DataGridContainer, { DataGridContainerInstance } from './DataGridContainer';
import { stickyColumnCN, stickyColumnStyles } from './styles';
import Empty from '../Empty';
import { TableColProps } from '../Table/TableCol';
import TableColumn from '../Table/TableColumn';
import { TableHeaderProps } from '../Table/TableHeader';
import TableRow, { TableRowProps } from '../Table/TableRow';

type DataGridComponentsType<P> =
  | ComponentType<P>
  | ForwardRefExoticComponent<P>
  | FC<P>
  | keyof ReactHTML;

type DataGridComponents<HeaderRowProps, HeaderCellProps, BodyRowProps, BodyCellProps> = {
  header?: {
    row?: DataGridComponentsType<HeaderRowProps>;
    cell?: DataGridComponentsType<HeaderCellProps>;
  };
  body?: {
    row?: DataGridComponentsType<BodyRowProps>;
    cell?: DataGridComponentsType<BodyCellProps>;
  };
};

export type DataGridColumn<T, BodyCellProps = TableColProps, HeaderCellProps = TableHeaderProps> = {
  key: string;
  dataIndex?: keyof T;
  title: ReactNode;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  fixed?: true | 'left' | 'right';
  onHeaderCell?: () => HeaderCellProps;
  onCell?: (record: T, rowIndex: number) => BodyCellProps;
  render?: (text: ReactNode, record: T, index: number) => ReactNode;
};

type DataGridGetRowIDHandler<T> = (row: T, index: number) => Key;

type GetRowIDProperty<T> = T extends { id: string }
  ? { getRowID?: DataGridGetRowIDHandler<T> }
  : { getRowID: DataGridGetRowIDHandler<T> };

export type DataGridProps<T, BodyRowProps, BodyCellProps, HeaderRowProps, HeaderCellProps> = {
  components?: DataGridComponents<HeaderRowProps, HeaderCellProps, BodyRowProps, BodyCellProps>;
  columns: Array<DataGridColumn<T, BodyCellProps, HeaderCellProps>>;
  data?: T[];
  scroll?: { x?: number };
} & GetRowIDProperty<T>;

const defaultFixedColWidth = 180;

function renderCells<T, IsHeader extends boolean, HeaderCellProps, BodyCellProps>(
  C: DataGridComponentsType<IsHeader extends true ? HeaderCellProps : BodyCellProps>,
  isHeader: IsHeader,
  rowIndex: number,
  record: T,
  columns: Array<DataGridColumn<T, unknown, unknown>>,
  render: (column: DataGridColumn<T, unknown, unknown>) => ReactNode
) {
  const ans: ReactNode[] = [];
  const stack: Array<DataGridColumn<T, unknown, unknown>> = [];
  const lStack: typeof stack = [];
  const rStack: typeof stack = [];
  const fixedLeftSize: Array<string | number> = [];
  const fixedRightSize: Array<string | number> = [];
  const Component = C as DataGridComponentsType<PropsWithChildren>;

  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];

    if (!column.fixed) {
      stack.push(column);
    } else if (column.fixed === 'left') {
      lStack.push(column);
    } else if (column.fixed === 'right') {
      rStack.push(column);
    }
  }

  for (let j = 0; j < lStack.length; j += 1) {
    const column = lStack[j];
    const shadowed = j === lStack.length - 1;
    const getProps = isHeader ? column.onHeaderCell : column.onCell;
    const props = getProps?.(record, rowIndex);

    ans.push(
      <Component
        {...(props || {})}
        key={column.key}
        className={classNames(get(props, 'className'), stickyColumnCN, {
          shadowed,
          leftLast: shadowed,
        })}
        style={{
          ...get(props, 'style') as unknown as CSSProperties,
          left: fixedLeftSize.length === 0 ? 0 : `calc(${fixedLeftSize.join('+')})`,
          zIndex: 3,
        }}
      >
        {render(column)}
      </Component>
    );

    if (column.width) {
      fixedLeftSize.push(typeof column.width === 'number' ? `${column.width}px` : column.width);
    } else {
      fixedLeftSize.push(`${defaultFixedColWidth}px`);
    }
  }

  for (let j = 0; j < stack.length; j += 1) {
    const column = stack[j];
    const getProps = isHeader ? column.onHeaderCell : column.onCell;
    const props = getProps?.(record, rowIndex) || {};

    ans.push(
      <Component {...props} key={column.key}>
        {render(column)}
      </Component>
    );
  }

  for (let j = rStack.length - 1; j >= 0; j -= 1) {
    const column = rStack[j];
    const shadowed = j === rStack.length - 1;
    const getProps = isHeader ? column.onHeaderCell : column.onCell;
    const props = getProps?.(record, rowIndex) || {};

    ans.push(
      <Component
        {...props}
        key={column.key}
        className={classNames(get(props, 'className'), stickyColumnCN, { shadowed, rightLast: shadowed })}
        style={{
          ...get(props, 'style') as never as CSSProperties,
          right: fixedRightSize.length === 0 ? 0 : `calc(${fixedRightSize.join('+')})`,
          zIndex: 3,
        }}
      >
        {render(column)}
      </Component>
    );

    if (column.width) {
      fixedRightSize.push(typeof column.width === 'number' ? `${column.width}px` : column.width);
    } else {
      fixedRightSize.push(`${defaultFixedColWidth}px`);
    }
  }

  return ans;
}

const defaultComponents = {
  header: {
    row: Table.Row,
    cell: Table.Header,
  },
  body: {
    row: Table.Row,
    cell: Table.Col,
  },
};

function DataGrid<
  T,
  HeaderRowProps = TableRowProps,
  HeaderCellProps = TableHeaderProps,
  BodyRowProps = TableRowProps,
  BodyCellProps = TableColProps
>({
  components,
  columns = [],
  data,
  scroll,
  getRowID,
}: DataGridProps<T, BodyRowProps, BodyCellProps, HeaderRowProps, HeaderCellProps>) {
  const containerEl = useRef<DataGridContainerInstance>(null);
  const HeaderRow = (components?.header?.row ||
    defaultComponents.header.row) as DataGridComponentsType<PropsWithChildren>;
  const BodyRow = (components?.body?.row ||
    defaultComponents.body.row) as DataGridComponentsType<PropsWithChildren>;

  return (
    <DataGridContainer ref={containerEl}>
      <Table
        stickyHeader
        style={{ tableLayout: 'fixed', width: scroll?.x || undefined, minWidth: '100%' }}
      >
        <Table.ColGroup>
          {columns.map((c) => {
            const width = c.fixed && !c.width ? defaultFixedColWidth : c.width;
            return <Table.ColGroup.Col key={c.key} width={width} />;
          })}
        </Table.ColGroup>
        <Table.Head>
          <HeaderRow>
            {renderCells(
              components?.header?.cell ||
                (defaultComponents.header.cell as ForwardRefExoticComponent<HeaderCellProps>),
              true,
              0,
              {} as never,
              columns,
              (c) => c.title
            )}
          </HeaderRow>
        </Table.Head>
        <Table.Body>
          {!data?.length && (
            <TableRow>
              <TableColumn colSpan={columns.length}>
                <Empty style={{ padding: '24px 0' }} />
              </TableColumn>
            </TableRow>
          )}

          {data?.map((item, i) => {
            const key =
              getRowID?.(item, i) || ((item as Record<string, unknown>)?.id as string) || i;

            return (
              <BodyRow key={key}>
                {renderCells(
                  components?.body?.cell ||
                    (defaultComponents.body.cell as ForwardRefExoticComponent<BodyCellProps>),
                  false,
                  i,
                  item,
                  columns,
                  (c) => {
                    const text = c.dataIndex ? (item[c.dataIndex] as ReactNode) : '';
                    return c.render?.(text, item, i) || text;
                  }
                )}
              </BodyRow>
            );
          })}
        </Table.Body>
      </Table>

      {stickyColumnStyles}
    </DataGridContainer>
  );
}

export default DataGrid;
