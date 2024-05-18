import React, { useState, useEffect } from 'react';
import { initGoogleAPI, login } from './apis/googleAPI';
import { useAppContext } from './AppContext';
import Login from './pages/Login';
import Resolution from './pages/Resolution';

function AppPlay({ gameId }) {
  const { setToken, setGameID, CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setGameID(gameId);
  }, [gameId, setGameID]);

  const handleLogin = async () => {
    try {
      await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
      const newToken = await login();
      if (newToken) {
        setToken(newToken);
        setIsLoggedIn(true);
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

