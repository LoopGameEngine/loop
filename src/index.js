import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import App from './App';
import AppPlay from './AppPlay';
import { AppContextProvider } from './AppContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const root = createRoot(document.getElementById('root'));

// Función para detectar el subdominio
const getSubdomain = () => {
  const host = window.location.host;
  const subdomain = host.split('.')[0];
  return subdomain === 'play';
};

const isPlaySubdomain = getSubdomain();

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          {isPlaySubdomain ? (
            <>
              <Route path="/:gameId" element={<AppPlay />} />
              <Route path="*" element={<AppPlay />} />
            </>
          ) : (
            <>
              <Route path="/*" element={<App />} />
            </>
          )}
        </Routes>
      </ThemeProvider>
    </AppContextProvider>
  </BrowserRouter>
);


