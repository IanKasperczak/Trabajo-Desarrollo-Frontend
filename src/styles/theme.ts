import { alpha, createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

export type ModoTema = 'light' | 'dark'

// Neutros con un toque cálido (el tono del amarillo de la marca) en vez de grises puros
const brand = '#FFC107'

// Curvas con más carácter que las de CSS (ease-out fuerte: responde al instante)
export const easeOut = 'cubic-bezier(0.23, 1, 0.32, 1)'
const press = `transform 160ms ${easeOut}`

const headingFont = '"Bebas Neue", "Inter", sans-serif'

const heading = (letterSpacing: string) => ({
  fontFamily: headingFont,
  fontWeight: 400,
  letterSpacing,
  lineHeight: 1.1,
})

// Todo lo que cambia entre claro y oscuro está acá
const paletas = {
  light: {
    ink: '#1F1D17', // texto y trazos
    surface: '#F4F3EF', // fondo de la app
    paper: '#FFFFFF', // tarjetas, campos
    bar: '#1F1D17', // barra superior
    side: '#262520', // barra lateral
    shadow: '31, 29, 23',
  },
  dark: {
    ink: '#F2F0E8',
    surface: '#141310',
    paper: '#1E1D19',
    bar: '#0E0D0B',
    side: '#1A1915',
    shadow: '0, 0, 0',
  },
} as const

export const crearTema = (mode: ModoTema): Theme => {
  const p = paletas[mode]
  const oscuro = mode === 'dark'
  // Texto sobre el amarillo: siempre oscuro, en cualquier modo
  const onBrand = '#1F1D17'
  const rgb = (a: number) => `rgba(${p.shadow}, ${a})`

  const sombraTarjeta = oscuro
    ? `0 1px 2px ${rgb(0.4)}, 0 6px 16px -6px ${rgb(0.5)}`
    : `0 1px 2px ${rgb(0.06)}, 0 4px 14px -4px ${rgb(0.1)}`
  const sombraHover = oscuro
    ? `0 2px 4px ${rgb(0.4)}, 0 12px 28px -8px ${rgb(0.65)}`
    : `0 2px 4px ${rgb(0.06)}, 0 10px 24px -6px ${rgb(0.16)}`
  const sombraDialog = oscuro
    ? `0 4px 8px ${rgb(0.4)}, 0 24px 56px -12px ${rgb(0.8)}`
    : `0 4px 8px ${rgb(0.08)}, 0 24px 56px -12px ${rgb(0.35)}`

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brand,
        dark: '#E5AC00',
        contrastText: onBrand,
      },
      text: {
        primary: p.ink,
        secondary: alpha(p.ink, 0.68),
      },
      background: {
        default: p.surface,
        paper: p.paper,
      },
      divider: alpha(p.ink, 0.1),
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: heading('0.02em'),
      h2: heading('0.02em'),
      h3: heading('0.02em'),
      h4: heading('0.03em'),
      h5: heading('0.03em'),
      h6: heading('0.04em'),
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: 0,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            '--sombra-tarjeta': sombraTarjeta,
            '--sombra-tarjeta-hover': sombraHover,
            '--borde-hover': alpha(p.ink, 0.22),
          },
          html: {
            textRendering: 'optimizeLegibility',
            scrollbarColor: `${alpha(p.ink, 0.28)} transparent`,
          },
          body: { fontVariantNumeric: 'lining-nums' },
          // Lo que no dibujamos nosotros también lleva la marca
          '::selection': { backgroundColor: alpha(brand, 0.5), color: oscuro ? '#FFFFFF' : onBrand },
          ':focus-visible': { outline: `2px solid ${oscuro ? brand : p.ink}`, outlineOffset: 2 },
          'h1, h2, h3, h4, h5, h6': { textWrap: 'balance' },
          'table, [data-tabular]': { fontVariantNumeric: 'tabular-nums' },
          '::-webkit-scrollbar': { width: 10, height: 10 },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(p.ink, 0.25),
            borderRadius: 8,
            border: `2px solid ${p.surface}`,
          },
          '::-webkit-scrollbar-thumb:hover': { backgroundColor: alpha(p.ink, 0.4) },
          // Entrada de cada pantalla: un solo movimiento corto
          '@keyframes page-enter': {
            from: { opacity: 0, transform: 'translateY(6px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              animationDuration: '1ms !important',
              transitionDuration: '1ms !important',
            },
          },
        },
      },
      MuiButtonBase: {
        defaultProps: { disableRipple: true },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: `${press}, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease`,
            '&:active': { transform: 'scale(0.97)' },
          },
          containedPrimary: {
            boxShadow: `inset 0 -1px 0 ${alpha('#1F1D17', 0.18)}`,
            '&:hover': { backgroundColor: '#FFCA2C' },
          },
          outlined: {
            borderColor: alpha(p.ink, 0.25),
            color: p.ink,
            '&:hover': { borderColor: alpha(p.ink, 0.5), backgroundColor: alpha(p.ink, 0.05) },
          },
          outlinedError: {
            '&:hover': { backgroundColor: alpha('#D32F2F', 0.08) },
          },
          text: { '&:hover': { backgroundColor: alpha(p.ink, 0.07) } },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: `${press}, background-color 160ms ease`,
            '&:active': { transform: 'scale(0.94)' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: { borderColor: alpha(p.ink, 0.1) },
        },
      },
      MuiCard: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            borderRadius: 14,
            borderColor: alpha(p.ink, 0.1),
            boxShadow: 'var(--sombra-tarjeta)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 7 },
          sizeSmall: { height: 22, fontSize: '0.72rem' },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: p.paper,
            transition: 'box-shadow 160ms ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(p.ink, 0.22),
              transition: 'border-color 160ms ease',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(p.ink, 0.5) },
            '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(brand, oscuro ? 0.3 : 0.35)}` },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: oscuro ? brand : p.ink,
              borderWidth: 1,
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { '&.Mui-focused': { color: oscuro ? brand : p.ink } },
        },
      },
      MuiDialog: {
        defaultProps: { transitionDuration: { enter: 220, exit: 140 } },
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: sombraDialog,
            ...(oscuro && { border: `1px solid ${alpha(p.ink, 0.1)}` }),
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: { ...heading('0.03em'), fontSize: '1.6rem', paddingBottom: 12 },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: { backgroundColor: oscuro ? 'rgba(0, 0, 0, 0.65)' : alpha('#1F1D17', 0.5) },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: { backgroundColor: 'transparent' },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiAlert: {
        styleOverrides: { root: { borderRadius: 10, fontWeight: 500 } },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: p.bar },
          colorPrimary: {
            backgroundColor: p.bar,
            boxShadow: `0 1px 0 ${alpha('#FFFFFF', 0.06)}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: p.side,
            borderRight: oscuro ? `1px solid ${alpha('#FFFFFF', 0.06)}` : 'none',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            transition: `${press}, background-color 160ms ease, color 160ms ease`,
            '&:active': { transform: 'scale(0.97)' },
            '&.Mui-selected': {
              backgroundColor: alpha(brand, oscuro ? 0.22 : 0.3),
              color: p.ink,
              '&:hover': { backgroundColor: alpha(brand, oscuro ? 0.3 : 0.4) },
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: oscuro ? '#2C2B26' : '#1F1D17',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            borderRadius: 6,
          },
        },
      },
    },
  })
}
