import { createElement, CSSProperties, forwardRef } from 'react';

import classNames from 'classnames';
import css from 'styled-jsx/css';

import config from '@/utils/config';
import theme from '@/utils/theme';

import { TextAlign, TextElement, TextLineHeight, TextMargin, TextProps } from './types';
import { calcLineHeight, calcMargin, calcSize, calcTextAlign, defaultSize } from './utils';

const style = ({
  weight,
  fullWidth,
  color,
  hoverColor,
  whiteSpace,
}: Required<Pick<TextProps, 'weight' | 'fullWidth' | 'color' | 'hoverColor'>> & {
  whiteSpace?: CSSProperties['whiteSpace'];
}) => css.resolve`
  .text {
    width: ${fullWidth ? '100%' : 'auto'};
    display: ${fullWidth ? 'block' : 'inline-block'};
    ${color ? `color: ${color};` : ''}
    ${whiteSpace ? `white-space: ${whiteSpace};` : ''}
      font-family: ${theme.fontFamily.primary};
    font-weight: ${weight};
    margin-block-start: 0;
    margin-block-end: 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
    margin-left: 0;
    margin-right: 0;
    word-break: break-word;
    letter-spacing: 0.01em;
    transition: color 0.2s ease-in-out;
  }

  .text:hover {
    ${hoverColor ? `color: ${hoverColor};` : ''}
  }
`;

const responsiveStyle = ({
  size,
  lineHeight,
  marginStart,
  marginEnd,
  align,
}: Required<Pick<TextProps, 'size'>> & {
  lineHeight?: TextLineHeight;
  marginStart?: TextMargin;
  marginEnd?: TextMargin;
  align?: TextAlign;
}) => {
  const sizeXs = calcSize(size, 'xs', defaultSize);
  const sizeSm = calcSize(size, 'sm', defaultSize);
  const sizeMd = calcSize(size, 'md', defaultSize);
  const sizeLg = calcSize(size, 'lg', defaultSize);
  const sizeXl = calcSize(size, 'xl', defaultSize);

  return css.resolve`
    @media only screen and (min-width: 0px) {
      .text {
        font-size: ${sizeXs}px;
        line-height: ${calcLineHeight(lineHeight, 'xs', sizeXs + 4)}px;
        margin-top: ${calcMargin(marginStart, 'xs')}px;
        margin-bottom: ${calcMargin(marginEnd, 'xs')}px;
        text-align: ${calcTextAlign(align, 'xs')};
      }
    }

    @media only screen and (min-width: ${theme.screen.xs}px) {
      .text {
        font-size: ${sizeSm}px;
        line-height: ${calcLineHeight(lineHeight, 'sm', sizeSm + 4)}px;
        margin-top: ${calcMargin(marginStart, 'sm')}px;
        margin-bottom: ${calcMargin(marginEnd, 'sm')}px;
        text-align: ${calcTextAlign(align, 'sm')};
      }
    }

    @media only screen and (min-width: ${theme.screen.sm}px) {
      .text {
        font-size: ${sizeMd}px;
        line-height: ${calcLineHeight(lineHeight, 'md', sizeMd + 4)}px;
        margin-top: ${calcMargin(marginStart, 'md', 0)}px;
        margin-bottom: ${calcMargin(marginEnd, 'md', 0)}px;
        text-align: ${calcTextAlign(align, 'md')};
      }
    }

    @media only screen and (min-width: ${theme.screen.md}px) {
      .text {
        font-size: ${sizeLg}px;
        line-height: ${calcLineHeight(lineHeight, 'lg', sizeLg + 4)}px;
        margin-top: ${calcMargin(marginStart, 'lg')}px;
        margin-bottom: ${calcMargin(marginEnd, 'lg')}px;
        text-align: ${calcTextAlign(align, 'lg')};
      }
    }

    @media only screen and (min-width: ${theme.screen.lg}px) {
      .text {
        font-size: ${sizeXl}px;
        line-height: ${calcLineHeight(lineHeight, 'xl', sizeXl + 4)}px;
        margin-top: ${calcMargin(marginStart, 'xl')}px;
        margin-bottom: ${calcMargin(marginEnd, 'xl')}px;
        text-align: ${calcTextAlign(align, 'xl')};
      }
    }
  `;
};

const Text = forwardRef<TextElement, TextProps>(
  (
    {
      as = 'span',
      className: classNameProp,
      size = defaultSize,
      lineHeight,
      weight = 400,
      fullWidth,
      color = 'inherit',
      hoverColor = color,
      marginStart,
      marginEnd,
      whiteSpace,
      align,
      ...props
    }: TextProps,
    ref
  ) => {
    const styleProp = {
      size,
      lineHeight,
      weight,
      fullWidth: fullWidth ?? false,
      color,
      hoverColor,
      marginStart,
      marginEnd,
      whiteSpace,
      align,
    };

    const { className: styleClassname, styles } = style(styleProp);
    const { className: responsiveClassname, styles: responsiveStyles } = responsiveStyle(styleProp);
    const className = classNames('text', styleClassname, responsiveClassname, classNameProp);
    const element = createElement(as ?? 'span', { ...props, ref, className });

    return (
      <>
        {element}
        {styles}
        {responsiveStyles}
      </>
    );
  }
);

if (config.isDev) {
  Text.displayName = 'Text';
}

export default Text;
