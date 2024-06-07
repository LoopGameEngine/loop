import { createTheme } from '@mui/material/styles';

const colors = {
  primaryMain: '#2E64EC',
  secondaryMain: '#FFC107',
  white: '#FFFFFF',
  darkOverlay: 'rgba(35, 35, 35, 0.5)',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primaryMain,
    },
    secondary: {
      main: colors.secondaryMain,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  // personalized styles
  customStyles: {
    footer: {
      py: 3,
      px: 2,
      mt: 'auto',
      backgroundColor: colors.primaryMain,
      color: colors.white,
    },
  },
  heroSection: {
    heroContainer: {
      position: 'relative',
      minHeight: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '36px',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: colors.primaryMain,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.darkOverlay,
      zIndex: 0,
    },
    content: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
    },
    logo: {
      width: '400px',
      marginBottom: '40px',
    },
    title: {
      color: colors.white,
      marginBottom: '20px',
    },
    subtitle: {
      color: colors.white,
      marginBottom: '20px',
    },
    startButton: {
      marginTop: '24px',
    },
  },
});

export default theme;
