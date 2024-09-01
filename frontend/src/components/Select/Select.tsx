/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useEffect,
  FocusEventHandler,
  MouseEventHandler,
  ChangeEvent,
  ChangeEventHandler,
  InputHTMLAttributes,
  ReactElement,
  forwardRef,
  useState,
  useRef,
  Children,
  useMemo,
  cloneElement,
  useCallback,
  ReactNode,
  ForwardedRef,
} from 'react';

import classNames from 'classnames';
import isEqual from 'lodash.isequal';
import isNil from 'lodash.isnil';
import css from 'styled-jsx/css';

import Paper from '@/components/Paper';
import Popper from '@/components/Popper';
import TextField, { TextFieldProps } from '@/components/TextField';

import log from '@/utils/log';

import SelectOption from './SelectOption';
import ClickAwayListener from '@/components/ClickAwayListener';
import ArrowDropDownIcon from '@/components/Icon/icons/ArrowDropDownIcon';
import ArrowDropUpIcon from '@/components/Icon/icons/ArrowDropUpIcon';
import useForkRef from '@/hooks/useForkRef';

export type SelectInstance = HTMLInputElement;

export type SelectOptionProps<T> = Omit<React.LiHTMLAttributes<HTMLLIElement>, 'value'> & {
  value?: T;
};

export type SelectChildren<T> =
  | ReactElement<SelectOptionProps<T>>[]
  | ReactElement<SelectOptionProps<T>>;

export type SelectProps<T> = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  open?: boolean;
  fullWidth?: boolean;
  value?: T;
  label?: string;
  TextFieldProps?: TextFieldProps;
  children: ReactNode;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onBlur?: (e: MouseEvent | TouchEvent) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onOpen?: () => void;
  onClose?: () => void;
};

const makeStateValue = <T,>(value: SelectProps<T>['value']) => {
  if (Array.isArray(value)) return value;
  return isNil(value) ? [] : [value];
};

const { className: inputClassname, styles: inputStyles } = css.resolve`
  .textfield :global(input) {
    caret-color: transparent;
    cursor: pointer;
  }

  .textfield :global(.arrow) {
    pointer-events: none;
  }
`;

function InternalSelect<T>(
  {
    className: classNameProp,
    open: openProp,
    name,
    fullWidth,
    onClick,
    onBlur,
    onChange,
    onFocus,
    onOpen,
    onClose,
    value,
    label,
    placeholder,
    children,
    isOptionEqualToValue = (option, v) => option === v,
    TextFieldProps: TextFieldPropsProp,
    ...props
  }: SelectProps<T>,
  ref: ForwardedRef<SelectInstance>
) {
  const [values, setValues] = useState<Array<T>>(makeStateValue(value));
  const [open, setOpen] = useState(openProp ?? false);
  const containerEl = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const className = classNames('select', { fullWidth }, classNameProp);
  const textFieldClassName = classNames(inputClassname, TextFieldPropsProp?.className);
  const handleInputRef = useForkRef(ref, inputEl);

  const handleOpen = useCallback(() => {
    setOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const displayValues = useCallback(
    (c?: SelectChildren<T>) => {
      if (!c) return null;
      return Children.map(c, (child) => {
        if (values.find((o) => isEqual(o, child?.props?.value)) === undefined) return null;
        if (isNil(child.props.value)) return null;
        if (typeof child.props.value === 'string' && !child.props.value.trim()) return null;

        return child.props.children;
      });
    },
    [values]
  );

  const transformedChildren = useMemo(
    () =>
      Children.map(children as SelectChildren<T>, (child: ReactElement) => {
        if (!child) return null;
        if (child?.type !== SelectOption) {
          log.debug("Warning Select has children that aren't SelectOption components");
          return child;
        }

        const childClassname = classNames([
          child.props.className,
          values.find((o) => isOptionEqualToValue(o, child.props.value)) !== undefined
            ? 'active'
            : null,
        ]);

        const handleOnClick: MouseEventHandler<HTMLLIElement> = (e) => {
          let newValue: Array<T> = [];

          if (!isNil(child.props.value)) {
            newValue = [child.props.value];
          }

          setValues(newValue);
          handleClose();

          if (onChange) {
            const nativeEvent = e.nativeEvent || e;

            Object.defineProperty(nativeEvent, 'target', {
              writable: true,
              value: { value: newValue[0] ?? null, name },
            });

            onChange(nativeEvent as unknown as ChangeEvent<HTMLInputElement>);
          }

          inputEl.current?.focus();
        };

        return cloneElement(child, {
          className: childClassname,
          onClick: (e: React.MouseEvent<HTMLLIElement>) => {
            handleOnClick(e);
            if (open && child.props.onClick) child.props.onClick(e);
          },
        });
      }),
    [children, handleClose, isOptionEqualToValue, name, onChange, open, values]
  );

  const focus = useCallback(() => {
    if (!open) {
      handleOpen();
    }

    inputEl.current?.focus();
  }, [handleOpen, open]);

  const handleClick: MouseEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      focus();
      if (onClick) onClick(e);
    },
    [focus, onClick]
  );

  const handleOnFocus: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      focus();
      if (onFocus) onFocus(e);
    },
    [focus, onFocus]
  );

  const handleOnBlur = useCallback(
    (e: MouseEvent | TouchEvent) => {
      handleClose();
      if (onBlur) onBlur(e);
    },
    [handleClose, onBlur]
  );

  useEffect(() => {
    setValues(makeStateValue(value));
  }, [value]);

  return (
    <ClickAwayListener onClickAway={handleOnBlur}>
      <div {...props} ref={containerEl} className={className}>
        <TextField
          {...TextFieldPropsProp}
          readOnly
          autoComplete='off'
          className={textFieldClassName}
          fullWidth
          ref={handleInputRef}
          label={label}
          placeholder={placeholder}
          suffix={
            <>
              {TextFieldPropsProp?.suffix}
              <span className='arrow'>
                {open && <ArrowDropUpIcon size='1.5rem' />}
                {!open && <ArrowDropDownIcon size='1.5rem' />}
              </span>
            </>
          }
          value={
            displayValues(children as SelectChildren<T>)
              ?.join(' ')
              .trim() ?? ''
          }
          onFocus={handleOnFocus}
          onClick={handleClick}
          onChange={() => null}
        />

        {containerEl.current && (
          <Popper
            open={open}
            anchorEl={containerEl.current}
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: { offset: () => [0, -12] },
                },
              ],
            }}
            style={{ width: containerEl.current.clientWidth, zIndex: 1300 }}
          >
            <Paper elevation={1}>
              <ul>{transformedChildren}</ul>
            </Paper>
          </Popper>
        )}
        {inputStyles}
        <style jsx>
          {`
            .select {
              width: 25ch;
              display: inline-block;
              position: relative;
            }

            .select.fullWidth {
              width: 100%;
            }

            ul {
              margin: 0;
              padding: 0;
              cursor: pointer;
              max-height: 40vh;
              overflow: auto;
            }
          `}
        </style>
      </div>
    </ClickAwayListener>
  );
}

const Select = forwardRef(InternalSelect) as unknown as typeof InternalSelect & {
  Option: typeof SelectOption;
};

Select.Option = SelectOption;

export default Select;
