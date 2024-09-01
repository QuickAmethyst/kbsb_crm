import { ChangeEventHandler, forwardRef, useCallback } from 'react';

import TextField, { TextFieldProps } from '@/components/TextField';
import handleNumericChange from '@/utils/handleNumericChange';

export type NumericTextFieldRef = HTMLInputElement;
export type NumericTextFieldProps = Omit<TextFieldProps, 'inputMode'>;

const NumericTextField = forwardRef<NumericTextFieldRef, NumericTextFieldProps>(
  ({ name, onChange, ...props }, ref) => {
    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        handleNumericChange(e, name);

        if (onChange) onChange(e);
      },
      [name, onChange]
    );

    return (
      <TextField {...props} ref={ref} name={name} inputMode='numeric' onChange={handleChange} />
    );
  }
);

export default NumericTextField;
