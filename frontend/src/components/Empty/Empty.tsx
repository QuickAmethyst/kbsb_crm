import { CSSProperties, forwardRef, HTMLAttributes, ReactNode, Ref } from 'react';

import classNames from 'classnames';

import Text from '@/components/Text';
import theme from '@/utils/theme';

import EmptyDefaultImage from './EmptyDefaultImage';

export type EmptyInstance = HTMLDivElement;
export type EmptyProps = HTMLAttributes<HTMLDivElement> & {
  image?: ReactNode;
  description?: ReactNode;
  imageStyle?: CSSProperties;
};

const defaultDescription = (
  <Text size={16} color={theme.color.grey[4]}>
    No Data
  </Text>
);

function Empty(
  {
    className: classNameProp,
    image = <EmptyDefaultImage />,
    imageStyle,
    description = defaultDescription,
    ...props
  }: EmptyProps,
  ref: Ref<EmptyInstance>
) {
  return (
    <div {...props} ref={ref} className={classNames(classNameProp, 'empty')}>
      <div className='empty-image' style={imageStyle}>
        {image}
      </div>

      <div className='empty-description'>{description}</div>

      <style jsx>
        {`
          .empty {
            width: 100%;
            text-align: center;
          }

          .empty > .empty-image {
            margin-bottom: 12px;
          }

          .empty > .empty-image > svg {
            height: 100%;
            margin: auto;
          }

          .empty > .empty-image > img {
            height: 100%;
          }
        `}
      </style>
    </div>
  );
}

export default forwardRef(Empty);
