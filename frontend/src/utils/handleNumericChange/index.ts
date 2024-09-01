import { ChangeEvent } from 'react';

const handleNumericChange = (e: ChangeEvent<HTMLInputElement>, name?: string) => {
  e.target.value = e.target.value?.replace(/[^0-9]/g, '');
  e.target.value = e.target.value?.replace(/^00(?! \d+$)/g, '0');
  e.target.value = e.target.value?.startsWith('0') ? '0' : e.target.value;

  Object.defineProperty(e, 'target', {
    writable: true,
    value: { value: e.target.value || null, name },
  });
};

export default handleNumericChange;
