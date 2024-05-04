import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import App from './App';
import AppPlay from './AppPlay';
import { AppContextProvider } from './AppContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const root = createRoot(document.getElementById('root'));

root.render(
  <HashRouter>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="*" element={<App />} />
          <Route path="/play/:gameId" element={<AppPlay />} />
        </Routes>
      </ThemeProvider>
    </AppContextProvider>
  </HashRouter>

);
