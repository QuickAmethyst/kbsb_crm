import { forwardRef, InputHTMLAttributes } from 'react';

import config from '@/utils/config';
import theme from '@/utils/theme';

export type BaseInputRefAttr = HTMLInputElement;
export type BaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
  fullWidth?: boolean;
};

const BaseInput = forwardRef<BaseInputRefAttr, BaseInputProps>(
  ({ readOnly, fullWidth, ...props }, ref) => (
    <>
      <input {...props} ref={ref} readOnly={readOnly} />
      <style jsx>
        {`
          input {
            ${fullWidth ? 'width: 100%;' : ''}
            line-height: 18px;
            font-family: ${theme.fontFamily.primary};
            font-size: 14px;
            letter-spacing: 0.00938em;
            margin: 0;
            padding: 0;
            outline: none;
            border: none;
            background: transparent;
            color: ${theme.color.grey[6]};
            caret-color: ${theme.color.grey[6]};
            pointer-events: ${readOnly ? 'none' : 'auto'};
          }

          input:-webkit-autofill,
          input:-webkit-autofill::first-line,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            font-size: 14px;
            font-family: ${theme.fontFamily.primary};
            -webkit-text-fill-color: ${theme.color.grey[6]};
            background-color: transparent !important;
          }

          input[type='search']::-webkit-search-decoration,
          input[type='search']::-webkit-search-cancel-button,
          input[type='search']::-webkit-search-results-button,
          input[type='search']::-webkit-search-results-decoration {
            -webkit-appearance: none;
          }

          input:focus,
          input:active {
            border: unset;
          }

          input::placeholder {
            font-size: inherit;
            color: ${theme.color.grey[3]};
            transition: opacity 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
          }

          input:placeholder-shown {
            text-overflow: ellipsis;
          }

          input:disabled {
            opacity: 0.4;
          }
        `}
      </style>
    </>
  )
);

if (config.isDev) {
  BaseInput.displayName = 'BaseInput';
}

export default BaseInput;
