import { forwardRef, memo, ReactNode, Ref } from 'react';

import Icon, { IconInstance, IconProps } from './Icon';

export default function createSvgIcon(path: ReactNode, options?: IconProps['SvgProps']) {
  function Component(props: Omit<IconProps, 'SvgProps'>, ref: Ref<IconInstance>) {
    return (
      <Icon ref={ref} {...props} SvgProps={options}>
        {path}
      </Icon>
    );
  }

  return memo(forwardRef(Component));
}
