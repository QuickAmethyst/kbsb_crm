import { AnchorHTMLAttributes, ForwardedRef, forwardRef, ButtonHTMLAttributes } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash.isempty';

import config from '@/utils/config';
import theme from '@/utils/theme';

export type BaseButtonInstance = HTMLButtonElement;
export type BaseButtonAnchorProps = Pick<
  AnchorHTMLAttributes<HTMLButtonElement>,
  'href' | 'target' | 'rel'
>;
export type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  BaseButtonAnchorProps & {
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    fullWidth?: boolean;
    disabled?: boolean;
  };

const BaseButton = forwardRef<BaseButtonInstance, BaseButtonProps>(
  (
    {
      fullWidth,
      className: classNameProp,
      disabled,
      type = 'button',
      children,
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const className = classNames(classNameProp, { fullWidth, disabled });
    const isAnchor = !isEmpty(href);

    return (
      <>
        {isAnchor && (
          <a
            {...(props as unknown as AnchorHTMLAttributes<HTMLAnchorElement>)}
            ref={ref as unknown as ForwardedRef<HTMLAnchorElement>}
            className={className}
            href={href}
            target={target}
            rel={rel}
          >
            {children}
          </a>
        )}
        {!isAnchor && (
          // eslint-disable-next-line react/button-has-type
          <button {...props} ref={ref} type={type} className={className}>
            {children}
          </button>
        )}
        <style jsx>
          {`
            button,
            a {
              position: relative;
              padding: 0;
              margin: 0;
              letter-spacing: 0.02857em;
              line-height: normal;
              display: inline-flex;
              justify-content: center;
              align-items: center;
              outline: 0;
              user-select: none;
              text-decoration: none;
              background-color: transparent;
              -webkit-tap-highlight-color: transparent;
              border: 0;
              border-radius: 0;
              transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
                border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
                color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
              vertical-align: middle;
              color: ${theme.color.grey[6]};
              cursor: pointer;
            }

            button.fullWidth,
            a.fullWidth {
              width: 100%;
            }

            button.disabled,
            a.disabled {
              pointer-events: none;
              cursor: default;
            }
          `}
        </style>
      </>
    );
  }
);

if (config.isDev) {
  BaseButton.displayName = 'BaseButton';
}

export default BaseButton;
