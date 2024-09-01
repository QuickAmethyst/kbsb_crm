import { createContext } from 'react';

export type FormControlContextValue = {
  fullWidth?: boolean;
  color?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
};

// @ts-ignore
export default createContext<FormControlContextValue>(undefined);
