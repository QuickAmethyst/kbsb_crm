import { CSSProperties } from 'react';

import { TextAlign, TextLineHeight, TextMargin, TextScreenSize } from './types';

export const defaultSize = 14;

export function calcSize<T>(
  size: T | Partial<Record<TextScreenSize, T>> | undefined | null,
  screenSize: TextScreenSize,
  defaultValue: T
): T {
  if (size === null || size === undefined) return defaultValue;

  if (
    Object.keys(size).length !== 0 &&
    (size as Record<TextScreenSize, T>).constructor === Object &&
    screenSize
  ) {
    const objSize = size as Record<TextScreenSize, T>;
    const sizes: Array<TextScreenSize> = ['xl', 'lg', 'md', 'sm', 'xs'];
    for (let i = sizes.indexOf(screenSize); i < sizes.length; i += 1) {
      const currSize = sizes[i];
      if (objSize[currSize] !== null && objSize[currSize] !== undefined) {
        return calcSize(objSize[currSize], screenSize, defaultValue);
      }
    }

    return defaultValue;
  }

  return size as T;
}

export function calcLineHeight(
  lineHeight?: TextLineHeight,
  screenSize: TextScreenSize = 'xs',
  defaultValue = defaultSize + 4
): number {
  return calcSize(lineHeight, screenSize, defaultValue);
}

export function calcMargin(
  margin?: TextMargin,
  screenSize: TextScreenSize = 'xs',
  defaultValue = 0
): number {
  return calcSize(margin, screenSize, defaultValue);
}

export function calcTextAlign(
  textAlign?: TextAlign,
  screenSize: TextScreenSize = 'xs',
  defaultValue = 'unset' as const
): CSSProperties['textAlign'] {
  return calcSize(textAlign, screenSize, defaultValue);
}
