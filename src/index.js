import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import App from './App';
import AppPlay from './AppPlay'; 
import { AppContextProvider } from './AppContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const root = createRoot(document.getElementById('root'));
const isPlaySubdomain = window.location.hostname.startsWith('play.');

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        {/* Renderiza la aplicación correspondiente según el subdominio */}
        {isPlaySubdomain ? <AppPlay /> : <App />}
      </ThemeProvider>
    </AppContextProvider>
  </BrowserRouter>
);
