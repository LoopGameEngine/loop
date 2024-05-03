import React, { useState } from 'react';
import { initGoogleAPI, login } from './apis/googleAPI';
import { useAppContext } from './AppContext';
import Login from './pages/Login';
import Play from './pages/Play';
import { useParams } from 'react-router-dom';

function AppPlay() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setToken, CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();
  const { gameId } = useParams();

  const handleLogin = async () => {
    await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
    const newToken = await login();
    if (newToken) {
      setToken(newToken);
      setIsLoggedIn(true);
    } else {
      console.log("Error en el login: No se obtuvo el token");
    }
  };

  if (isLoggedIn) {
    console.log(gameId);
    return <Play gameId={gameId} />;  // Muestra Play sin cambiar la URL
  }

  return <Login onLogin={handleLogin} />;
}

export default AppPlay;

