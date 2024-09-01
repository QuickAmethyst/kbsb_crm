import { createElement, ReactNode, useCallback, useEffect, useRef } from 'react';

import DialogContent from './DialogContent';
import DialogTitle from './DialogTitle';
import Paper, { PaperProps } from '../Paper';
import Fade from '../Transition/Fade';
import { TransitionHandlerProps } from '../Transition/types';

export type DialogConfig = { disableOverlayClick?: boolean };
export type DialogCloseReason = 'overlayClick';
export type DialogCloseHandler = (reason: DialogCloseReason) => void;
export type DialogProps = TransitionHandlerProps &
  DialogConfig & {
    open?: boolean;
    width?: number;
    PaperComponent?: React.ComponentType;
    PaperProps?: PaperProps;
    onClose?: DialogCloseHandler;
    children?: ReactNode;
  };

function Dialog({
  children,
  open,
  width,
  PaperComponent = Paper,
  PaperProps: PaperPropsProp = { elevation: 24 },
  disableOverlayClick,
  onClose,
  onExited,
  ...otherProps
}: DialogProps) {
  const overlayClick = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    overlayClick.current = e.target === e.currentTarget;
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (!overlayClick.current) return;
    overlayClick.current = false;
    if (!disableOverlayClick && onClose) onClose('overlayClick');
  }, [disableOverlayClick, onClose]);

  const handleOnExited = useCallback(
    (node: HTMLElement) => {
      if (onExited) onExited(node);
    },
    [onExited]
  );

  useEffect(() => {
    if (open) document.body.style.overflowY = 'hidden';
    else document.body.style.removeProperty('overflowY');
  }, [open]);

  if (!open) return null;

  return (
    <div aria-hidden className='dialog' onClick={handleOverlayClick}>
      <Fade {...otherProps} in={open} appear onExited={handleOnExited}>
        <div role='button' tabIndex={-1} className='container' onMouseDown={handleMouseDown}>
          <div className='overlay' />
          <div className='wrapper'>
            {createElement<PaperProps>(
              PaperComponent,
              {
                ...PaperPropsProp,
                style: {
                  ...PaperPropsProp?.style,
                  display: 'flex',
                  flexDirection: 'column',
                },
              },
              children
            )}
          </div>
        </div>
      </Fade>
      <style jsx>
        {`
          .dialog {
            position: fixed;
            z-index: 1300;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }

          .container {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .overlay {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .wrapper {
            overflow-y: scroll;
            margin: 32px;
            min-width: 300px;
            max-height: calc(100% - 64px);
            ${width ? `width: ${width}px` : ''};
            ${width ? `max-width: ${width}px` : ''};
          }
        `}
      </style>
    </div>
  );
}

Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;

export default Dialog;
