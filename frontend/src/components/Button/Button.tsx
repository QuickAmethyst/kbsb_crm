import { CSSProperties, ForwardedRef, forwardRef } from 'react';

import classNames from 'classnames';
import css from 'styled-jsx/css';

import hexToRgba from '@/utils/hexToRgba';
import theme from '@/utils/theme';

import BaseButton, { BaseButtonProps } from '@/components/BaseButton';
import CircularProgress from '@/components/CircularProgress';
import { elevationCss } from '@/components/Paper';

export type ButtonRef = HTMLButtonElement;
export type ButtonColor = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'default' | 'medium';
export type ButtonVariant = 'contained' | 'outlined';
export type ButtonProps = BaseButtonProps & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  loading?: boolean;
};

const backgroundColor = (
  variant: ButtonVariant,
  color?: ButtonColor,
  type?: 'hover' | 'active' | 'disabled'
): CSSProperties['backgroundColor'] => {
  if (variant === 'outlined') {
    return 'transparent';
  }

  if (type === 'hover') {
    if (color === 'secondary') return theme.color.green[4];
    if (color === 'danger') return theme.color.red[4];
    return theme.color.violet[5];
  }

  if (type === 'active') {
    if (color === 'secondary') return theme.color.green[6];
    if (color === 'danger') return theme.color.red[5];
    return theme.color.violet[6];
  }

  if (type === 'disabled') {
    if (color === 'secondary') return theme.color.green[3];
    return theme.color.violet[3];
  }

  if (color === 'secondary') return theme.color.green[7];
  if (color === 'danger') return theme.color.red[6];

  return theme.color.violet[4];
};

const borderColor = (
  variant: ButtonVariant,
  color?: ButtonColor,
  type?: 'hover' | 'active' | 'disabled'
): CSSProperties['borderColor'] => {
  if (variant === 'contained') return 'unset';

  if (type === 'hover') {
    if (color === 'secondary') return hexToRgba(theme.color.green[4], 0.5);
    if (color === 'danger') return hexToRgba(theme.color.red[4], 0.5);
    return hexToRgba(theme.color.violet[5], 0.38);
  }

  if (type === 'active') {
    if (color === 'secondary') return hexToRgba(theme.color.green[6], 0.5);
    if (color === 'danger') return hexToRgba(theme.color.red[5], 0.5);
    return hexToRgba(theme.color.violet[6], 0.5);
  }

  if (type === 'disabled') {
    if (color === 'secondary') return hexToRgba(theme.color.green[3], 0.5);
    return hexToRgba(theme.color.violet[3], 0.5);
  }

  if (color === 'secondary') return hexToRgba(theme.color.green[7], 0.5);
  if (color === 'danger') return hexToRgba(theme.color.red[6], 0.5);

  return hexToRgba(theme.color.violet[5], 0.5);
};

const border = (
  variant: ButtonVariant,
  color?: ButtonColor,
  type?: 'hover' | 'active' | 'disabled'
): CSSProperties['border'] => {
  if (variant === 'contained') return 'unset';

  const borderColorVal = borderColor(variant, color, type);

  return `1px solid ${borderColorVal}`;
};

const padding = (size?: ButtonSize) => {
  if (size === 'medium') return '10px 16px';
  return '6px 12px';
};

const fontColor = (
  variant: ButtonVariant,
  color?: ButtonColor,
  type?: 'hover' | 'active' | 'disabled'
): CSSProperties['color'] => {
  if (variant !== 'outlined') return theme.color.black[1];

  return borderColor(variant, color, type);
};

const getButtonCss = ({ color, size, variant = 'outlined' }: ButtonProps) => css.resolve`
  .btn {
    color: ${fontColor(variant, color)};
    background-color: ${backgroundColor(variant, color)};
    font-size: 14px;
    font-weight: 700;
    box-shadow: ${variant !== 'outlined' ? elevationCss[1] : 'unset'};
    padding: ${padding(size)};
    border-radius: 4px;
    text-transform: uppercase;
    border: ${border(variant, color)};
  }

  .btn:hover {
    color: ${fontColor(variant, color, 'hover')};
    background-color: ${backgroundColor(variant, color, 'hover')};
    border: ${border(variant, color, 'hover')};
  }

  .btn:visited,
  .btn:active {
    color: ${fontColor(variant, color, 'active')};
    background-color: ${backgroundColor(variant, color, 'active')};
    border: ${border(variant, color, 'active')};
  }

  a.btn:visited {
    color: ${fontColor(variant, color)};
    background-color: ${backgroundColor(variant, color)};
    border: ${border(variant, color)};
  }

  .btn.disabled {
    color: ${fontColor(variant, color, 'disabled')};
    background-color: ${backgroundColor(variant, color, 'disabled')};
    border: ${border(variant, color, 'disabled')};
  }

  .btn > :global(.icon) {
    margin: 0 0 0.1em 0;
  }
`;

function Button({
  color: colorProp,
  className: classNameProp,
  children,
  loading,
  disabled: disabledProp,
  variant = 'contained',
  ...props
}: ButtonProps, ref: ForwardedRef<ButtonRef>) {
  const { className: btnClassname, styles: btnStyles } = getButtonCss({
    color: colorProp,
    disabled: disabledProp,
    variant,
    ...props,
  });

  const className = classNames('btn', btnClassname, classNameProp);
  const disabled = disabledProp || loading;

  return (
    <BaseButton {...props} ref={ref} className={className} disabled={disabled}>
      {!loading && children}
      {loading && <CircularProgress color={backgroundColor(variant, colorProp)} size={16} />}
      {btnStyles}
    </BaseButton>
  );
}

export default forwardRef(Button);
