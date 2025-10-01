import { extendTheme } from '@chakra-ui/react';

const fonts = {
  heading:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  body:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'"
};

const styles = {
  global: {
    'html, body, #root': {
      height: '100%'
    },
    body: {
      bgGradient: 'linear(to-b, gray.50, white)',
      color: 'gray.900',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      letterSpacing: '-0.01em'
    }
  }
};

const components = {
  Button: {
    baseStyle: {
      rounded: 'full',
      fontWeight: 'semibold'
    },
    sizes: {
      lg: {
        px: 6,
        h: 12
      }
    }
  },
  Container: {
    baseStyle: {
      maxW: '6xl'
    }
  }
};

const shadows = {
  soft: '0 10px 30px rgba(0,0,0,0.06)'
};

const theme = extendTheme({
  fonts,
  styles,
  components,
  shadows
});

export default theme;


