import {
  ForwardedRef,
  LabelHTMLAttributes,
  ReactHTML,
  ReactNode,
  createElement,
  forwardRef,
} from 'react';

import classNames from 'classnames';
import css from 'styled-jsx/css';

import hexToRgba from '@/utils/hexToRgba';
import theme from '@/utils/theme';

import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';

export type FormLabelInstance = HTMLLabelElement;
export type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  as?: keyof ReactHTML;
  children?: ReactNode;
  color?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
};

const createStyles = ({
  color = theme.color.grey[6],
}: Pick<FormLabelProps, 'color' | 'disabled'>) => css.resolve`
  .form-label {
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 1.4375em;
    padding-bottom: 2px;
    letter-spacing: 0.00938em;
    color: ${color};
  }

  .form-label.disabled {
    color: ${hexToRgba(color, 0.5)};
  }

  .form-label.error {
    color: ${theme.color.red[6]};
  }

  .form-label.required:after {
    content: '*';
    color: ${theme.color.red[6]};
  }
`;

function FormLabel(
  { as = 'label', className: classNameProp, children, error, ...props }: FormLabelProps,
  ref: ForwardedRef<FormLabelInstance>
) {
  const formControl = useFormControl();
  const fcs = formControlState({
    props: { error, ...props },
    formControl,
    states: ['color', 'required', 'disabled', 'error'],
  });

  const { className: rootClassname, styles: rootStyles } = createStyles({
    color: fcs.color,
    disabled: fcs.disabled,
  });

  const className = classNames('form-label', rootClassname, classNameProp, {
    error: fcs.error,
    disabled: fcs.disabled,
    required: fcs.required,
  });

  return createElement(
    as,
    {
      ref,
      className,
      ...props,
    },
    <>
      {children}
      {rootStyles}
    </>
  );
}

export default forwardRef(FormLabel);
