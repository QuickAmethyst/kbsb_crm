import css from 'styled-jsx/css';

import theme from '@/utils/theme';
import roboto from '@/utils/theme/fonts/roboto';

export default css.global`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: ${roboto.style.fontFamily};
    font-size: ${theme.fontSize.htmlFontSize}px;
    color: ${theme.color.grey[6]};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
`;
