import { forwardRef, LiHTMLAttributes, Ref } from 'react';

import hexToRgba from '@/utils/hexToRgba';
import theme from '@/utils/theme';

export type SelectOptionProps<T> = Omit<LiHTMLAttributes<HTMLLIElement>, 'value'> & {
  value?: T;
};

const itemBackground = (param: { focus: boolean }) => {
  if (param.focus) return hexToRgba(theme.color.grey[6], 0.16);
  return 'transparent';
};

function InternalSelectOption<T>(
  { value, children, ...props }: SelectOptionProps<T>,
  ref: Ref<HTMLLIElement>
) {
  return (
    <li {...props} ref={ref} value={value as never}>
      {children}
      <style jsx>
        {`
          li {
            padding: 8px 10px;
            list-style-type: none;
            background-color: ${itemBackground({ focus: false })};
          }

          li:hover,
          li.active {
            background-color: ${itemBackground({ focus: true })};
          }
        `}
      </style>
    </li>
  );
}

const SelectOption = forwardRef(InternalSelectOption);

export default SelectOption;
