import { extendTheme } from '@chakra-ui/react';

const fonts = {
  heading:
    "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  body:
    "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'"
};

const styles = {
  global: {
    'html, body, #root': {
      height: '100%'
    },
    body: {
      bg: 'gray.50',
      color: 'gray.900',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      letterSpacing: '-0.01em',
      lineHeight: '1.6'
    },
    a: {
      color: 'gray.800',
      textDecoration: 'none',
      textUnderlineOffset: '3px',
    }
  }
};

const components = {
  Button: {
    baseStyle: {
      rounded: 'full',
      fontWeight: 'semibold'
    },
    variants: {
      solid: {
        bg: 'black',
        color: 'white',
        _hover: { bg: 'gray.800' }
      },
      ghost: {
        color: 'gray.700',
        _hover: { bg: 'gray.100' }
      }
    },
    sizes: {
      lg: {
        px: 6,
        h: 12
      }
    }
  },
  Link: {
    baseStyle: {
      color: 'gray.800',
      textDecoration: 'none',
      textUnderlineOffset: '3px',
      _hover: { color: 'black', textDecoration: 'none' }
    }
  },
  Table: {
    variants: {
      notion: {
        th: {
          fontWeight: 'medium',
          color: 'gray.700',
          bg: 'transparent',
          borderColor: 'gray.200'
        },
        td: {
          borderColor: 'gray.200'
        },
        tr: {
          _hover: { bg: 'gray.50' }
        }
      }
    }
  },
  Container: {
    baseStyle: {
      maxW: '4xl'
    }
  },
  Modal: {
    baseStyle: {
      dialog: {
        rounded: 'xl',
        boxShadow: 'soft'
      }
    }
  }
};

const shadows = {
  soft: '0 10px 30px rgba(0,0,0,0.06)',
  page: '0 10px 20px rgba(0,0,0,0.04)'
};

const theme = extendTheme({
  fonts,
  styles,
  components,
  shadows
});

export default theme;


