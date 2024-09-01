import roboto from './fonts/roboto';

const screen = {
  xs: 575,
  sm: 767,
  md: 991,
  lg: 1199,
  xl: 1599,
};

const fontSize = {
  htmlFontSize: 14,
};

const fontFamily = {
  primary: roboto.style.fontFamily,
};

const color = {
  black: { 1: '#FFFFFF', 4: '#F0F0F0', 13: '#000000' },
  grey: {
    1: '#e9e9e9',
    2: '#C9C9C9',
    3: '#9F9F9F',
    4: '#727272',
    5: '#474747',
    6: '#1F1F1F',
    7: '#1a1a1a',
    8: '#161616',
    9: '#121212',
    10: '#0e0e0e',
  },
  violet: { 1: '#F0EEF6', 2: '#E8E5F1', 3: '#D0C9E3', 4: '#6750A4', 5: '#5D4894', 6: '#524083' },
  green: {
    1: '#E7FDF5',
    2: '#c5fae8',
    3: '#97f6d6',
    4: '#66F1C3',
    5: '#38EDB0',
    6: '#0CE99F',
    7: '#0AC687',
  },
  red: { 4: '#EA6A6A', 5: '#E33D3D', 6: '#DD1313' },
};

const theme = {
  screen,
  fontFamily,
  fontSize,
  color,
};

export default theme;
