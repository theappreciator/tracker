import { ThemeProvider, createTheme } from '@mui/material';
import '../styles/global.css'
import { AppProps } from 'next/app'

// Or Create your Own theme:
const theme = createTheme({
  palette: {
    primary: {
      main: "#66c2a5"
    },
    secondary: {
      main: '#004B89'
    },
  },
  components: {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          transform: "none",
        }
      }
    }
  }
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
