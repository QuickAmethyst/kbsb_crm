import { createContext } from 'react';

export type FormControlContextValue = {
  fullWidth?: boolean;
  color?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default createContext<FormControlContextValue>(undefined);
