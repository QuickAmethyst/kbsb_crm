import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode, useId, useRef } from 'react';

import BaseInput, { BaseInputRefAttr } from '@/components/BaseInput';
import useForkRef from '@/hooks/useForkRef';

import TextFieldRoot from '@/components/TextFieldRoot';

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
  required?: boolean;
  fullWidth?: boolean;
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  helperText?: string | false;
  error?: boolean;
};

export type TextFieldInstance = HTMLInputElement;

function TextField(
  { id: idProp, label, prefix, suffix, error, helperText, ...props }: TextFieldProps,
  ref: ForwardedRef<TextFieldInstance>
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const inputRef = useRef<BaseInputRefAttr>(null);
  const handleInputRef = useForkRef(ref, inputRef);

  return (
    <TextFieldRoot
      {...props}
      role='textbox'
      id={id}
      label={label}
      prefix={prefix}
      suffix={suffix}
      error={error}
      helperText={helperText}
    >
      <BaseInput {...props} ref={handleInputRef} id={id} fullWidth className='content-input' />
    </TextFieldRoot>
  );
}

export default forwardRef(TextField);
