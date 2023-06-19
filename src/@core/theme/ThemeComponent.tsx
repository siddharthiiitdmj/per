// ** React Imports
import { ReactNode } from 'react'
import {useRouter} from 'next/router'

// ** MUI Imports
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Config
import themeConfig from 'src/configs/themeConfig'

// ** Direction component for LTR or RTL
import Direction from 'src/layouts/components/Direction'

// ** Theme
import themeOptions from './ThemeOptions'

// ** Global Styles
import GlobalStyling from './globalStyles'

interface Props {
  settings: Settings
  children: ReactNode
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { settings, children } = props
  const router = useRouter();
  const pathname = router.pathname
  
  // Check if the current URL is '/login'
  const isLoginPage = (pathname === '/login' || pathname === '/register');

  // Set the background image style based on the condition
  const backgroundImage = isLoginPage ? 'url(/images/background.jpg)' : 'none';

  // ** Pass merged ThemeOptions (of core and user) to createTheme function
  let theme = createTheme(themeOptions(settings, 'light'))

  // ** Set responsive font sizes to true
  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme)
  }

  return (
    <ThemeProvider theme={theme}>
      <Direction direction={settings.direction}>
        <CssBaseline />
        <GlobalStyles
          styles={() => ({
            ...GlobalStyling(theme),
            body: {
              backgroundImage: isLoginPage ? backgroundImage : 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            },
          })}
        />
        {children}
      </Direction>
    </ThemeProvider>
  )
}

export default ThemeComponent
