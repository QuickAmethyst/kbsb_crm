import { forwardRef, HTMLAttributes, Ref } from 'react';

import classNames from 'classnames';

import hexToRgba from '@/utils/hexToRgba';
import theme from '@/utils/theme';

import { IconProps } from '../Icon/Icon';
import ReceiptLongOutlinedIcon from '../Icon/icons/ReceiptLongOutlinedIcon';

export type EmptyDefaultImageInstance = HTMLDivElement;
export type EmptyDefaultImageProps = HTMLAttributes<HTMLDivElement> & {
  size?: IconProps['size'];
};

function EmptyDefaultImage(
  { className: classNameProp, size = 54, ...props }: EmptyDefaultImageProps,
  ref: Ref<EmptyDefaultImageInstance>
) {
  return (
    <div {...props} ref={ref} className={classNames('empty-image-default', classNameProp)}>
      <ReceiptLongOutlinedIcon size={size} color={hexToRgba(theme.color.violet[6], 0.8)} />

      <style jsx>
        {`
          .empty-image-default {
            display: inline-block;
            border-radius: 100%;
            padding: 14px;
            background-color: ${theme.color.grey[1]};
          }
        `}
      </style>
    </div>
  );
}

export default forwardRef(EmptyDefaultImage);
