import { CSSProperties, forwardRef, HTMLAttributes } from 'react';

import classNames from 'classnames';

import config from '@/utils/config';
import theme from '@/utils/theme';

export type CircularProgressVariant = 'indeterminate' | 'determinate';
export type CircularProgressRefAttr = HTMLSpanElement;
export type CircularProgressProps = HTMLAttributes<HTMLOrSVGElement> & {
  variant?: CircularProgressVariant;
  size?: string | number;
  color?: string;
  thickness?: number;
  value?: number;
};

const SIZE = 44;

const CircularProgress = forwardRef<CircularProgressRefAttr, CircularProgressProps>(
  (
    {
      className: classNameProp,
      size = 40,
      color = theme.color.violet[4],
      variant = 'indeterminate',
      thickness = 3.6,
      value = 0,
      style,
      ...props
    },
    ref
  ) => {
    const className = classNames('progress', classNameProp);
    const rootStyle: CSSProperties = {};
    const circleStyle: CSSProperties = {};

    if (variant === 'determinate') {
      const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
      circleStyle.strokeDasharray = circumference.toFixed(3);
      circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;
      rootStyle.transform = 'rotate(-90deg)';
    }

    return (
      <span
        {...props}
        ref={ref}
        role='progressbar'
        className={className}
        style={{ width: size, height: size, ...rootStyle, ...style }}
      >
        <svg viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
          {variant === 'determinate' && (
            <circle
              className='containment'
              cx={SIZE}
              cy={SIZE}
              r={(SIZE - thickness) / 2}
              fill='none'
              strokeWidth={thickness}
              strokeLinecap='round'
              style={{ ...circleStyle, strokeDashoffset: 0 }}
            />
          )}

          <circle
            className='fill'
            cx={SIZE}
            cy={SIZE}
            r={(SIZE - thickness) / 2}
            fill='none'
            strokeWidth={thickness}
            strokeLinecap='round'
            style={circleStyle}
          />
        </svg>
        <style jsx>
          {`
            .progress {
              display: inline-block;
              width: ${typeof size === 'number' ? `${size}px` : size};
              height: ${typeof size === 'number' ? `${size}px` : size};
              display: inline-block;
              color: ${color};
              ${variant === 'determinate'
                ? 'transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;'
                : ''}
              ${variant === 'indeterminate'
                ? 'animation: circularRotate 1.4s linear infinite;'
                : ''}
            }
            .progress > svg {
              display: block;
            }
            .progress > svg > .fill,
            .progress > svg > .containment {
              stroke-dasharray: 80px, 200px;
              stroke-dashoffset: 0px;
            }
            .progress > svg > .fill {
              stroke: currentColor;
              ${variant === 'indeterminate'
                ? 'animation: circularDash 1.4s ease-in-out infinite;'
                : ''}
            }
            .progress > svg > .containment {
              stroke: ${theme.color.black[1]};
            }
            @keyframes circularRotate {
              0% {
                transform-origin: 50% 50%;
              }
              100% {
                transform: rotate(360deg);
              }
            }
            @keyframes circularDash {
              0% {
                stroke-dasharray: 1px, 184px;
                stroke-dashoffset: 0px;
              }
              50% {
                stroke-dasharray: 100px, 200px;
                stroke-dashoffset: -15px;
              }
              100% {
                stroke-dasharray: 100px, 200px;
                stroke-dashoffset: -125px;
              }
            }
          `}
        </style>
      </span>
    );
  }
);

if (config.isDev) {
  CircularProgress.displayName = 'CircularProgress';
}

export default CircularProgress;
