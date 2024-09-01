import {
  createElement,
  CSSProperties,
  ReactHTML,
  ForwardedRef,
  forwardRef,
  ClassAttributes,
  HTMLAttributes,
  FormHTMLAttributes,
} from 'react';

import classNames from 'classnames';
import css from 'styled-jsx/css';

export type SpaceSize = number | [number, number];
export type SpacePaddingVal = CSSProperties['padding'];
export type SpaceAttributes<T extends keyof ReactHTML> = T extends 'form'
  ? FormHTMLAttributes<HTMLFormElement>
  : HTMLAttributes<HTMLDivElement>;

export type SpaceProps<T extends keyof ReactHTML = 'div'> = ClassAttributes<T> &
  SpaceAttributes<T> & {
    as?: T;
    fullWidth?: boolean;
    align?: 'start' | 'end' | 'center' | 'baseline';
    justify?: 'start' | 'end' | 'center' | 'baseline' | 'between';
    size?: SpaceSize;
    direction?: 'vertical' | 'horizontal';
    wrap?: boolean;
    padding?: SpacePaddingVal;
  };

function alignItems(align?: SpaceProps['align']): CSSProperties['alignItems'] {
  if (!align) return undefined;
  if (['start', 'end'].includes(align)) return `flex-${align}`;
  return align;
}

function justifyItems(justify?: SpaceProps['justify']): CSSProperties['justifyContent'] {
  if (justify === 'between') return 'space-between';
  return alignItems(justify);
}

function gap(size?: SpaceSize) {
  if (size === undefined || size === null) return '0';

  if (Array.isArray(size) && size.length > 0) {
    const [colGap, rowGap] = size as [number, number];
    return `${rowGap}px ${colGap}px`;
  }

  return `${size}px`;
}

function flexDirection(direction?: SpaceProps['direction']): CSSProperties['flexDirection'] {
  if (direction === 'vertical') return 'column';
  return 'row';
}

function makeStyles({
  align,
  justify,
  direction,
  wrap,
  fullWidth,
  size,
  padding,
}: Pick<
  SpaceProps,
  'align' | 'justify' | 'direction' | 'wrap' | 'fullWidth' | 'size' | 'padding'
>) {
  const alignItemsVal = alignItems(align);
  const justifyContentVal = justifyItems(justify);
  const gapVal = gap(size);

  return css.resolve`
    .space {
      display: inline-flex;
      ${alignItemsVal ? `align-items: ${alignItemsVal};` : ''}
      ${justifyContentVal ? `justify-content: ${justifyContentVal};` : ''}
      ${gapVal && gapVal !== '0' ? `gap: ${gapVal};` : ''}
      flex-direction: ${flexDirection(direction)};
      ${wrap ? `flex-wrap: wrap;` : ''}
      ${fullWidth ? 'width: 100%;' : ''}
      ${padding ? `padding: ${typeof padding === 'number' ? `${padding}px` : padding}` : ''}
    }
  `;
}

function Space<T extends keyof ReactHTML = 'div'>(
  {
    as,
    className: classNameProp,
    fullWidth,
    align = 'start',
    justify,
    direction,
    size,
    wrap,
    padding,
    ...props
  }: SpaceProps<T>,
  ref: ForwardedRef<HTMLElement>
) {
  const { className: classNameStyle, styles } = makeStyles({
    fullWidth,
    wrap,
    direction,
    align,
    justify,
    size,
    padding,
  });

  const className = classNames('space', classNameStyle, classNameProp);
  const element = createElement(as || 'div', { ...props, ref, className });
  return (
    <>
      {element}
      {styles}
    </>
  );
}

export default forwardRef(Space);
