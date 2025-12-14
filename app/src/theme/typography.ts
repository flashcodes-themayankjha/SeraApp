// app/src/theme/typography.ts
import { TextStyle } from 'react-native';

type TypographyStyle = {
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  letterSpacing?: number;
  textTransform?: TextStyle['textTransform'];
};

export const typography: Record<string, TypographyStyle> = {
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  section: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
};
