import { PropsWithChildren } from 'react';

import Divider from '../Divider';
import Text from '../Text';

export type DialogTitleProps = PropsWithChildren<{
  disableHeader?: boolean;
}>;

export default function DialogTitle({ disableHeader, children }: DialogTitleProps) {
  return (
    <div className='dialog-title'>
      {!disableHeader && (
        <>
          <div className='dialog-title-wrapper'>
            <Text as='h2' weight={600} size={18}>
              {children}
            </Text>
          </div>
          <Divider />
        </>
      )}

      {disableHeader && children}

      <style jsx>
        {`
          .dialog-title {
            flex: 0 0 auto;
            margin: 0;
          }

          .dialog-title > .dialog-title-wrapper {
            padding: 16px 24px;
          }
        `}
      </style>
    </div>
  );
}
