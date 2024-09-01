import { useContext } from 'react';

import FormControlContext from './FormControlContext';

export default function useFormControl() {
  return useContext(FormControlContext);
}
