import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { initGoogleAPI, login } from './apis/googleAPI';
import { useAppContext } from './AppContext';
import Login from './pages/Login';
import Resolution from './pages/Resolution';

function AppPlay() {
  const { setToken, setGameID, CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();
  const { gameId } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
      const newToken = await login();
      if (newToken) {
        setToken(newToken);
        setIsLoggedIn(true);
        setGameID(gameId);
      } else {
        console.log("Error en el login: No se obtuvo el token");
      }
    } catch (error) {
      console.error("Error en el login:", error);
    }
  };

  return (
    <div>
      {isLoggedIn ? <Resolution /> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default AppPlay;


