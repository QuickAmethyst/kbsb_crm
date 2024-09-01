import { CSSProperties, HTMLAttributes } from 'react';

export type TextHeadingType = 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextType = TextHeadingType | 'p' | 'span';
export type TextScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextSize = number | Partial<Record<TextScreenSize, number>>;
export type TextLineHeight = number | Partial<Record<TextScreenSize, number>>;
export type TextMargin = number | Partial<Record<TextScreenSize, number>>;
export type TextAlign =
  | CSSProperties['textAlign']
  | Partial<Record<TextScreenSize, CSSProperties['textAlign']>>;
export type TextElement<T extends TextType = TextType> = T extends TextHeadingType
  ? HTMLHeadingElement
  : T extends 'p'
  ? HTMLParagraphElement
  : HTMLSpanElement;

export type TextProps<T extends TextType = TextType> = HTMLAttributes<HTMLSpanElement> & {
  /**
   * The html tag used to render the text.
   * @default false
   */
  as?: T;
  /**
   * If `true`, the text` will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The font-size of the component
   * @default 16
   */
  size?: TextSize;
  /**
   * The line-height of the component
   * @default size + 4
   */
  lineHeight?: TextLineHeight;
  /**
   * The font-weight of the component
   * @default 400
   */
  weight?: CSSProperties['fontWeight'];
  /**
   * The text color of the component
   */
  color?: string;
  /**
   * The text color when hover of the component
   */
  hoverColor?: string;
  /**
   * Add space at the start of text
   * @default 0
   */
  marginStart?: TextMargin;
  /**
   * Add space at the end of text
   * @default 0
   */
  marginEnd?: TextMargin;
  /**
   * The white space style of text
   * @default initial
   */
  whiteSpace?: CSSProperties['whiteSpace'];
  /**
   * The text align style
   * @default unset
   */
  align?: TextAlign;
};
