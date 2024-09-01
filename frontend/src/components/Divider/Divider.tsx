import { CSSProperties, forwardRef, HTMLAttributes } from 'react';

import classNames from 'classnames';

import config from '@/utils/config';
import theme from '@/utils/theme';

export type DividerRef = HTMLDivElement;
export type DividerProps = HTMLAttributes<HTMLDivElement> & {
  color?: string;
  padded?: boolean;
  borderStyle?: CSSProperties['borderStyle'];
};

const Divider = forwardRef<DividerRef, DividerProps>(
  (
    {
      className: classNameProp,
      color = theme.color.grey[2],
      padded,
      borderStyle = 'solid',
      ...props
    },
    ref
  ) => {
    const className = classNames('divider', { padded }, classNameProp);

    return (
      <div {...props} ref={ref} className={className}>
        <style jsx>
          {`
            .divider {
              width: 100%;
              min-width: 100%;
              border-top: 1px ${borderStyle} ${color};
            }

            .divider.padded {
              margin: 12px 0;
            }
          `}
        </style>
      </div>
    );
  }
);

if (config.isDev) {
  Divider.displayName = 'Divider';
}

export default Divider;
