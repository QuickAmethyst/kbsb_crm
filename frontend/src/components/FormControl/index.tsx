import { ForwardedRef, HTMLAttributes, forwardRef, useMemo } from 'react';

import classNames from 'classnames';

import FormControlContext, { FormControlContextValue } from './FormControlContext';

export type FormControlInstance = HTMLDivElement;
export type FormControlProps = HTMLAttributes<HTMLDivElement> &
  FormControlContextValue & {
    bottomSpace?: boolean;
  };

function FormControl(
  {
    children,
    className: classNameProp,
    bottomSpace,
    color,
    fullWidth,
    required,
    disabled,
    error,
    ...props
  }: FormControlProps,
  ref: ForwardedRef<FormControlInstance>
) {
  const className = classNames('form-control', classNameProp, { fullWidth, bottomSpace });
  const contextValue = useMemo(
    () => ({
      fullWidth,
      color,
      required,
      disabled,
      error,
    }),
    [color, disabled, error, fullWidth, required]
  );

  return (
    <FormControlContext.Provider value={contextValue}>
      <div {...props} ref={ref} className={className}>
        {children}

        <style jsx>
          {`
            .form-control {
              position: relative;
              display: inline-flex;
              flex-direction: column;
            }

            .form-control.fullWidth {
              width: 100%;
            }

            .form-control.bottomSpace {
              padding-bottom: 22px;
            }
          `}
        </style>
      </div>
    </FormControlContext.Provider>
  );
}

export default forwardRef(FormControl);
