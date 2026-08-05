import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFC107',
      dark: '#FFB300',
      contrastText: '#212121',
    },
    text: {
      primary: '#212121',
      secondary: 'rgba(33, 33, 33, 0.7)',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Bebas Neue", "Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: '"Bebas Neue", "Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: '"Bebas Neue", "Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: '"Bebas Neue", "Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.03em',
    },
    h5: {
      fontFamily: '"Bebas Neue", "Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.03em',
    },
    h6: {
      fontFamily: '"Bebas Neue", "Inter", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.04em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#212121',
        },
        colorPrimary: {
          backgroundColor: '#212121',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2B2B2B',
          borderRight: 'none',
        },
      },
    },
  },
})