import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

import classNames from 'classnames';

import theme from '@/utils/theme';

import formControlState from '../FormControl/formControlState';
import useFormControl from '../FormControl/useFormControl';

export type FormHelperTextInstance = HTMLSpanElement;
export type FormHelperTextProps = HTMLAttributes<HTMLSpanElement> & {
  error?: boolean;
};

function FormHelperText(
  { className: classNameProp, children, ...props }: FormHelperTextProps,
  ref: ForwardedRef<FormHelperTextInstance>
) {
  const formControl = useFormControl();
  const fcs = formControlState({ props, formControl, states: ['error', 'color'] });

  return (
    <span
      {...props}
      ref={ref}
      className={classNames('helper', classNameProp, { error: fcs.error })}
    >
      {children}
      <style jsx>
        {`
          .helper {
            font-size: 12px;
            margin: 3px 14px 5px;
          }

          .helper.error {
            color: ${theme.color.red[6]};
          }
        `}
      </style>
      <style jsx>
        {`
          .helper {
            color: ${fcs.color};
          }
        `}
      </style>
    </span>
  );
}

export default forwardRef(FormHelperText);
