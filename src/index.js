import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import App from './App';
import AppPlay from './AppPlay';
import { AppContextProvider } from './AppContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const root = createRoot(document.getElementById('root'));


root.render(
  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/play/:gameId" element={<AppPlay />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AppContextProvider>
  </BrowserRouter>
);
