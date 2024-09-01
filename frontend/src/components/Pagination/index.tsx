import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

import classNames from 'classnames';
import css from 'styled-jsx/css';

import config from '@/utils/config';
import theme from '@/utils/theme';

import Button from '../Button';
import ChevronLeftIcon from '../Icon/icons/ChevronLeftIcon';
import ChevronRightIcon from '../Icon/icons/ChevronRightIcon';
import Space from '../Space';

export type PaginationChangeParam = { page: number; pageSize: number };
export type PaginationChangeHandler = (param: PaginationChangeParam) => void;
export type PaginationRef = { setCurrentPage: Dispatch<SetStateAction<number>> };
export type PaginationProps = {
  total?: number;
  pageSize?: number;
  currentPage?: number;
  hideOnSinglePage?: boolean;
  onChange?: PaginationChangeHandler;
};

const { className: btnClassname, styles: btnStyles } = css.resolve`
  .btn {
    font-size: 15px !important;
  }

  .btn.cursor {
    padding: 4px 6px;
  }

  .btn.ellipsis {
    background: transparent;
    box-shadow: none;
    cursor: default;
    color: ${theme.color.grey[6]};
  }

  .btn.ellipsis:hover {
    background-color: none;
  }
`;

function generateButton(
  count: number,
  currentPage: number
): Array<{ type: 'number' | 'ellipsis'; page: number }> {
  if (count < 7) {
    const result: Array<{ type: 'number' | 'ellipsis'; page: number }> = [];
    for (let i = 0; i < count; i += 1) {
      result.push({ type: 'number', page: i + 1 });
    }
    return result;
  }

  const firstList: Array<{ type: 'number' | 'ellipsis'; page: number }> = [
    { type: 'number', page: 1 },
    { type: currentPage > 4 ? 'ellipsis' : 'number', page: 2 },
  ];

  const middlePage: Array<number> = [];
  if (currentPage <= 4) {
    middlePage.push(3, 4, 5);
  } else if (currentPage >= count - 4) {
    middlePage.push(count - 4, count - 3, count - 2);
  } else {
    middlePage.push(currentPage - 1, currentPage, currentPage + 1);
  }

  const middleList: typeof firstList = middlePage.map((i) => ({ type: 'number', page: i }));

  const lastList: typeof firstList = [
    { type: currentPage < count - 4 ? 'ellipsis' : 'number', page: count - 1 },
    { type: 'number', page: count },
  ];

  return [...firstList, ...middleList, ...lastList];
}

const Pagination = forwardRef<PaginationRef, PaginationProps>(
  (
    {
      currentPage: currentPageProp,
      total: totalProp,
      pageSize: pageSizeProp,
      hideOnSinglePage,
      onChange,
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(currentPageProp || 1);
    const total = totalProp || 1;
    const pageSize = pageSizeProp || 1;
    const count = Math.ceil(total / pageSize) || 1;

    useImperativeHandle(ref, () => ({ setCurrentPage }));

    const handleOnClick = useCallback(
      (page: number) => () => {
        setCurrentPage(page);
        if (onChange) onChange({ page, pageSize });
      },
      [onChange, pageSize]
    );

    const handleOnNext = useCallback(() => setCurrentPage(currentPage + 1), [currentPage]);
    const handleOnPrev = useCallback(() => setCurrentPage(currentPage - 1), [currentPage]);

    if (hideOnSinglePage && pageSize === 1) return null;

    return (
      <Space size={8}>
        <Button
          className={classNames(btnClassname, 'cursor')}
          color='secondary'
          disabled={currentPage === 1}
          onClick={handleOnPrev}
        >
          <ChevronLeftIcon size={18} />
        </Button>
        {generateButton(count, currentPage).map((o) => (
          <Button
            key={o.page}
            className={classNames(btnClassname, { ellipsis: o.type === 'ellipsis' })}
            color={currentPage === o.page ? 'primary' : 'secondary'}
            onClick={o.type === 'ellipsis' ? undefined : handleOnClick(o.page)}
          >
            {o.type === 'ellipsis' ? '...' : o.page}
          </Button>
        ))}
        <Button
          className={classNames(btnClassname, 'cursor')}
          color='secondary'
          disabled={currentPage === count}
          onClick={handleOnNext}
        >
          <ChevronRightIcon size={18} />
        </Button>
        {btnStyles}
      </Space>
    );
  }
);

if (config.isDev) {
  Pagination.displayName = 'Pagination';
}

export default Pagination;
