import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';
import App from './App';
import AppPlay from './AppPlay';
import { AppContextProvider } from './AppContext';
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

const AppRouter = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gameId = queryParams.get('play');

  return (
    <Routes>
      <Route path="*" element={gameId ? <AppPlay gameId={gameId} /> : <App />} />
    </Routes>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </AppContextProvider>
  </BrowserRouter>
);

