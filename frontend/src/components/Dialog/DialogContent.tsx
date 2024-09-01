import { PropsWithChildren } from 'react';

import classNames from 'classnames';

import hexToRgba from '@/utils/hexToRgba';
import theme from '@/utils/theme';

export type DialogContentProps = PropsWithChildren<{
  dividers?: boolean;
}>;

export default function DialogContent({ dividers, children }: DialogContentProps) {
  return (
    <div className={classNames('dialog-content', { dividers })}>
      {children}

      <style jsx>
        {`
          .dialog-content {
            flex: 1 1 auto;
            padding: 16px 24px;
          }

          .dialog-content.dividers {
            padding: 16px 24px;
            border-top: 1px solid ${hexToRgba(theme.color.grey[6], 0.12)};
            border-bottom: 1px solid ${hexToRgba(theme.color.grey[6], 0.12)};
          }
        `}
      </style>
    </div>
  );
}
