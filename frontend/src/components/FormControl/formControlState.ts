import { FormControlContextValue } from './FormControlContext';

type FormControlStateArg = {
  props: Record<string, unknown>;
  formControl?: FormControlContextValue;
  states: Array<keyof FormControlContextValue>;
};

export default function formControlState({ props, states, formControl }: FormControlStateArg) {
  return states.reduce((acc, state: keyof FormControlContextValue) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acc[state] = props[state];

    if (formControl) {
      if (typeof props[state] === 'undefined') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        acc[state] = formControl[state];
      }
    }

    return acc;
  }, {} as FormControlContextValue);
}
