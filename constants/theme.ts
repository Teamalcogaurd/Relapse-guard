const colors = {
  bg: '#F8EFEB',
  bg2: '#F4EAE5',
  bg3: '#EEE3DA',

  card: 'rgba(255,253,252,0.94)',
  cardSoft: '#FBF5F1',
  cardLavender: '#F3EDFB',
  cardPeach: '#FAEEE7',

  border: '#E7D7CF',
  borderSoft: '#EFE3DD',

  heading: '#3E2420',
  text: '#6E5751',
  textSoft: '#7C6761',
  textMuted: '#9E8780',

  brown: '#6D4338',
  coral: '#E48677',
  peach: '#F2DFD4',
  lavender: '#E9DFF8',
  lavenderStrong: '#A185E8',
  blueSoft: '#DDE7FF',
  blueStrong: '#5E7FE6',
  sage: '#E7F3E8',
  sageStrong: '#4E9B62',
  amber: '#F7EBD8',
  amberStrong: '#D58A23',
  rose: '#F7E5EA',
  roseStrong: '#D86D7C',

  // New calming wellness colors
  softLavender: '#F0EAF8',
  beige: '#F9F5EE',
  softPurple: '#E6D7F3',
  teal: '#D1F0E8',
  softGreen: '#E8F5E8',
  glowLavender: 'rgba(161, 133, 232, 0.15)',
  glowTeal: 'rgba(77, 155, 98, 0.12)',

  icon: '#6D4338',
  iconSoft: '#8F746D',
  white: '#FFFFFF',
  shadow: 'rgba(109, 67, 56, 0.08)',

  // compatibility aliases
  surface: 'rgba(255,253,252,0.94)',
  surfaceSoft: '#FBF5F1',
  background: '#F8EFEB',
  backgroundSecondary: '#F4EAE5',
  primary: '#6D4338',
  primarySoft: '#E9DFF8',
  secondary: '#6E5751',
};

const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const radii = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

const shadows = {
  card: {
    shadowColor: '#B78F84',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  soft: {
    shadowColor: '#B78F84',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
};

const theme = {
  colors,
  spacing,
  radii,
  shadows,
};

export { colors, spacing, radii, shadows, theme };
export default theme;
