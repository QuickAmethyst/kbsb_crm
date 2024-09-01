import { ReactElement } from 'react';

import css from 'styled-jsx/css';

import theme from '@/utils/theme';

import CircularProgress, { CircularProgressProps } from '../CircularProgress';
import Space from '../Space';

export type SpinnerProps = {
  visible?: boolean;
  children: ReactElement;
  size?: CircularProgressProps['size'];
};

const { className: innerClassname, styles: innerStyles } = css.resolve`
  .space {
    position: absolute;
    inset: 0;
    justify-content: center;
    opacity: 0.6;
    background-color: ${theme.color.black[1]};
    margin-bottom: -1px;
  }
`;

export default function Spinner({ children, visible, size }: SpinnerProps) {
  return (
    <div className='spinner'>
      {children}
      {visible && (
        <Space className={innerClassname} align='center'>
          <CircularProgress size={size} />
        </Space>
      )}

      {innerStyles}
      <style jsx>
        {`
          .spinner {
            width: 100%;
            height: 100%;
            position: relative;
          }
        `}
      </style>
    </div>
  );
}
