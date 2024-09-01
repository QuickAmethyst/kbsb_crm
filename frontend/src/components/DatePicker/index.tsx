import {
  ChangeEventHandler,
  CSSProperties,
  ForwardedRef,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { formatDate } from 'date-fns/format';

import {
  DayPicker,
  DayPickerMultipleProps,
  DayPickerRangeProps,
  DayPickerSingleProps,
  DaySelectionMode,
  SelectMultipleEventHandler,
  SelectRangeEventHandler,
  SelectSingleEventHandler,
} from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import BaseButton from '@/components/BaseButton';
import ClickAwayListener from '@/components/ClickAwayListener';
import Paper from '@/components/Paper';
import Popper from '@/components/Popper';
import { TextFieldProps } from '@/components/TextField';
import useForkRef from '@/hooks/useForkRef';

import EventOutlinedIcon from '../Icon/icons/EventOutlinedIcon';
import { isValid } from 'date-fns/isValid';
import { parse } from 'date-fns/parse';

export type DatePickerRenderInputHandler = (
  props: TextFieldProps & { ref: RefObject<HTMLInputElement> }
) => ReactNode;

export type DatePickerMode = DaySelectionMode;
export type DatePickerBaseProps<T extends DatePickerMode> = T extends 'single'
  ? DayPickerSingleProps
  : T extends 'range'
  ? DayPickerRangeProps
  : T extends 'multiple'
  ? DayPickerMultipleProps
  : DayPickerSingleProps;

export type DatePickerSelectHandler<T extends DatePickerMode> = T extends 'single'
  ? SelectSingleEventHandler
  : T extends 'range'
  ? SelectRangeEventHandler
  : T extends 'multiple'
  ? SelectMultipleEventHandler
  : SelectSingleEventHandler;

export type DatePickerProps<T extends DatePickerMode> = DatePickerBaseProps<T> & {
  className?: string;
  open?: boolean;
  inputValue?: string;
  inputFormat?: string;
  style?: CSSProperties;
  renderInput: DatePickerRenderInputHandler;
  onInputChange?: ChangeEventHandler<HTMLInputElement>;
};

function renderSingleValue(format: string, day: Date | undefined, _: Date) {
  if (!day) return '';
  return formatDate(day, format)
}

function renderValue(_: DatePickerMode, format: string, ...args: unknown[]) {
  // @ts-expect-error returns `false`, need to handle dynamic arguments depends on `mode` prop.
  return renderSingleValue(format, ...args);
}

function DatePicker<T extends DatePickerMode = 'single'>(
  {
    mode,
    open: openProp,
    className: classNameProp,
    inputValue: inputValueProp,
    inputFormat = 'dd/MM/yyyy',
    style,
    renderInput,
    selected: selectedProp,
    onInputChange,
    onSelect,
  }: DatePickerProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [selected, setSelected] = useState<Date[]>(selectedProp as Date[]);
  const [open, setOpen] = useState(openProp);
  const [inputValue, setInputValue] = useState(inputValueProp || '');
  const rootEl = useRef<HTMLDivElement>(null);
  const focusRef = useRef(false);
  const handleRootRef = useForkRef(ref, rootEl);
  const inputEl = useRef<HTMLInputElement>(null);
  const clickMode = mode !== 'single';
  const defaultMonth = mode === 'single' && selected?.[0] ? selected[0] : undefined;
  const rootClassname = classNames('datepicker', { button: clickMode }, classNameProp);

  const handleOpen = useCallback(() => {
    setOpen((prevOpen) => {
      if (!prevOpen) return true;
      return prevOpen;
    });
  }, []);

  const handleClose = useCallback(() => {
    setOpen((prevOpen) => {
      if (prevOpen) return false;
      return prevOpen;
    });
  }, []);

  const resetInputValue = useCallback(
    (...args: unknown[]) => {
      let newInputValue = '';

      if (mode === 'single') {
        const typedArgs = args as Parameters<DatePickerSelectHandler<'single'>>;
        const isSelected = typedArgs[0] !== null && isValid(typedArgs[0]);
        if (isSelected) newInputValue = renderValue(mode, inputFormat, ...args);
      }

      setInputValue(newInputValue);
    },
    [inputFormat, mode]
  );

  const handleValue = useCallback(
    (...args: unknown[]) => {
      if (mode === 'single') {
        const typedArgs = args as Parameters<DatePickerSelectHandler<'single'>>;
        const newValue = typedArgs[0];
        if (newValue && isValid(newValue)) setSelected([newValue]);
        else setSelected([]);
      }

      // @ts-expect-error returns `false`, need to handle dynamic arguments depends on `mode` prop.
      if (onSelect) onSelect(...args);
    },
    [mode, onSelect]
  );

  const selectNewDate = useCallback(
    (...args: unknown[]) => {
      if (!focusRef.current) resetInputValue(...args);
      handleValue(...args);
      handleClose();
    },
    [handleClose, handleValue, resetInputValue]
  );

  const handleClickAway = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const handleClick = useCallback(() => {
    if (clickMode) {
      handleOpen();
    }
  }, [clickMode, handleOpen]);

  const handleFocus = useCallback(() => {
    focusRef.current = true;
  }, []);

  const handleBlur = useCallback(() => {
    focusRef.current = false;
    if (mode === 'single') resetInputValue(selected?.[0] || undefined);
  }, [mode, resetInputValue, selected]);

  const handleSelect: DatePickerProps<T>['onSelect'] = useCallback(
    (...args: unknown[]) => {
      selectNewDate(...args);
    },
    [selectNewDate]
  );

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const { value: newValue } = e.target;
      const inputIsEmpty = newValue === '';

      if (newValue !== inputValue) {
        setInputValue(newValue);
        if (onInputChange) onInputChange(e);
      }

      if (!inputIsEmpty) {
        if (mode === 'single') {
          handleValue(parse(newValue, inputFormat, new Date()));
        }
      } else if (mode === 'single') {
        handleValue(undefined);
      }
    },
    [handleValue, inputFormat, inputValue, mode, onInputChange]
  );

  useEffect(() => {
    selectNewDate(selectedProp);
  }, [selectNewDate, selectedProp]);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div ref={handleRootRef} className={rootClassname} style={style}>
        {renderInput({
          readOnly: clickMode,
          ref: inputEl,
          value: inputValue,
          suffix: (
            <BaseButton onClick={() => handleOpen()}>
              <EventOutlinedIcon size={18} />
            </BaseButton>
          ),
          onClick: handleClick,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onChange: handleInputChange,
        })}

        {rootEl.current && (
          <Popper
            open={open}
            anchorEl={rootEl.current}
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: { offset: () => [0, -10] },
                },
              ],
            }}
            style={{ zIndex: 1300 }}
          >
            <Paper elevation={1}>
              <DayPicker
                defaultMonth={defaultMonth}
                mode={mode}
                selected={selected as never}
                onSelect={handleSelect as never}
              />
            </Paper>
          </Popper>
        )}

        <style jsx>
          {`
            .datepicker {
              position: relative;
            }

            .datepicker.button {
              cursor: pointer;
            }
          `}
        </style>
      </div>
    </ClickAwayListener>
  );
}

export default forwardRef(DatePicker) as typeof DatePicker;
