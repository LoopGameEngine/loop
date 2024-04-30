// index.js
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import App from './App';
import { AppContextProvider } from './AppContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </AppContextProvider>
  </BrowserRouter>
);


