import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';

import classNames from 'classnames';
import css from 'styled-jsx/css';

import FormControl, { FormControlInstance } from '@/components/FormControl';
import hexToRgba from '@/utils/hexToRgba';
import theme from '@/utils/theme';

import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';
import FormHelperText from '../FormHelperText';
import FormLabel from '../FormLabel';

export type TextFieldInstance = FormControlInstance;
export type TextFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> & {
  fullWidth?: boolean;
  label?: ReactNode;
  className?: string;
  disabled?: boolean;
  color?: CSSProperties['color'];
  error?: boolean;
  required?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  helperText?: string | false;
};

type BodyProps = PropsWithChildren<Pick<TextFieldRootProps, 'fullWidth' | 'prefix' | 'suffix'>>;

const { className: rootClassname, styles: rootStyles } = css.resolve`
  .form-control {
    width: 190px;
  }

  .form-control.error {
    color: ${theme.color.red[6]};
  }

  .form-control :global(.content-input) {
    padding: 10px 12px;
  }
`;

function Body({ fullWidth, prefix, suffix, children, ...props }: BodyProps) {
  const formControl = useFormControl();
  const fcs = formControlState({ props, states: ['color', 'error', 'disabled'], formControl });
  const className = classNames('textfield', {
    fullWidth,
    error: fcs.error,
    disabled: fcs.disabled,
  });

  return (
    <div className={className}>
      {prefix && <div className='textfield-prefix'>{prefix}</div>}

      <div className={classNames('textfield-content', { prefix })}>{children}</div>

      {suffix && <div className='textfield-suffix'>{suffix}</div>}

      <style jsx>
        {`
          .textfield {
            display: flex;
            align-items: center;
            border-radius: 8px;
            border-style: solid;
            border-width: 1px;
            border-color: ${theme.color.grey[2]};
            overflow: hidden;
          }

          .textfield-content {
            width: 100%;
          }

          .textfield-content.prefix {
            padding-left: 6px;
          }

          .textfield.disabled {
            border-color: ${hexToRgba(theme.color.grey[2], 0.5)};
          }

          .textfield.error {
            border-color: ${theme.color.red[6]};
          }

          .textfield > .textfield-prefix,
          .textfield > .textfield-suffix {
            flex-shrink: 0;
            line-height: 0;
          }

          .textfield > .textfield-suffix {
            display: flex;
            justify-content: flex-end;
          }
        `}
      </style>
      <style jsx>
        {`
          .textfield {
            color: ${fcs.color};
          }
        `}
      </style>
    </div>
  );
}

function TextFieldRoot(
  {
    id,
    label,
    prefix,
    suffix,
    children,
    fullWidth,
    className,
    helperText,
    ...props
  }: TextFieldRootProps,
  ref: ForwardedRef<TextFieldInstance>
) {
  return (
    <FormControl
      {...props}
      ref={ref}
      fullWidth={fullWidth}
      className={classNames(rootClassname, className)}
      bottomSpace={helperText !== false && !helperText}
    >
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}

      <Body {...props} fullWidth={fullWidth} prefix={prefix} suffix={suffix}>
        {children}
      </Body>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}

      {rootStyles}
    </FormControl>
  );
}

export default forwardRef(TextFieldRoot);
