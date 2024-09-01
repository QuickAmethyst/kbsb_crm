import React, { forwardRef, HTMLAttributes, ReactNode, Ref, SVGAttributes } from 'react';

import classNames from 'classnames';

export type IconInstance = HTMLSpanElement;
export type IconProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  size?: `${number}px` | `${number}rem` | `${number}%` | number | 'inherit';
  color?: string;
  rotate?: number;
  SvgProps?: Omit<SVGAttributes<SVGSVGElement>, 'aria-hidden' | 'tabIndex' | 'focusable'>;
};

const fontSize = (size?: string | number) => {
  if (typeof size === 'string') return size;
  if (typeof size === 'number') return `${size}px`;
  return '16px';
};

function Icon(
  {
    color = 'inherit',
    size,
    className: classNameProp,
    children,
    SvgProps,
    rotate,
    ...props
  }: IconProps,
  ref: Ref<IconInstance>
) {
  const className = classNames('icon', classNameProp);

  return (
    <span {...props} ref={ref} className={className}>
      <svg {...SvgProps} aria-hidden='true' tabIndex={-1} focusable={false}>
        {children}
      </svg>

      <style jsx>
        {`
          .icon {
            display: inline-block;
            margin: 0.1em;
            box-sizing: border-box;
            outline: none;
            transition: transform 0.2s ease-in-out;
          }

          svg {
            width: 100%;
            height: 100%;
            fill: currentcolor;
            display: block;
            outline: none;
          }
        `}
      </style>
      <style jsx>
        {`
          .icon {
            color: ${color};
            width: ${fontSize(size)};
            height: ${fontSize(size)};
          }
        `}
      </style>
      <style jsx>
        {`
          .icon {
            transform: rotate(${rotate || 0}deg);
          }
        `}
      </style>
    </span>
  );
}

export default forwardRef(Icon);
