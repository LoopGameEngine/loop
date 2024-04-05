// App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getUserInfo, initGoogleAPI, login, logout } from './apis/googleAPI';
import { folderExists, createFolder } from './apis/driveAPI';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import Games from './pages/Games';
import Edit from './pages/Edit';
import Play from './pages/Play';
import Legal from './pages/Legal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';
import SessionDialog from './components/SessionDialog';
import { useAppContext } from './AppContext';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditorPage = location.pathname.includes('/edit');
  const { token, setToken, setUserInfo, setAppFolderID, setGameList, setUpdateGameList,
    expirationTimestamp, setExpirationTimestamp, isSessionTimeOver, setIsSessionTimeOver,
    CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();
  const isAuthenticated = token !== null;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      if (token) {
        if (currentTime >= expirationTimestamp) {
          console.log('La sesión ha expirado');
          setIsSessionTimeOver(true); 
          revokeToken(token.access_token);
          clearInterval(interval); 
        } else {
          const tiempoRestante = expirationTimestamp - currentTime;
          const minutosRestantes = Math.floor(tiempoRestante / 60000);
          const segundosRestantes = ((tiempoRestante % 60000) / 1000).toFixed(0);
          console.log(`${minutosRestantes} minutos y ${segundosRestantes} segundos restantes`);
        }
      } else {clearInterval(interval);}
    }, 1000);
     return () => clearInterval(interval);
  }, [expirationTimestamp, setIsSessionTimeOver, token]); // Incluye token como una dependencia
  
  const revokeToken = async (token) => {
    try {
      await fetch('https://oauth2.googleapis.com/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `token=${encodeURIComponent(token)}`,
      });
    } catch (error) {
      console.error('Error al revocar el token', error);
    }
  };

  const handleLogin = async () => {
    setIsSessionTimeOver(false);
    await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
    const newToken = await login();
    setToken(newToken);
    //  const expiresIn = newToken.expires_in;
    const expiresIn = 20;
    const expirationTimestamp = new Date().getTime() + expiresIn * 1000;
    setExpirationTimestamp(expirationTimestamp);
    let newAppFolderID = await folderExists("Loop Games", newToken.access_token);
    if (!newAppFolderID) {
      newAppFolderID = await createFolder("Loop Games", 'root', newToken.access_token);
    }
    setAppFolderID(newAppFolderID);
    const newUserInfo = await getUserInfo(newToken.access_token);
    setUserInfo(newUserInfo);
    setUpdateGameList(true);
    if (location.pathname === '/') navigate('/games');
  };

  const handleLogout = async () => {
    await logout();
    setToken(null);
    setUserInfo(null);
    setAppFolderID(null);
    setGameList([]);
    setIsSessionTimeOver(false);
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isEditorPage && <NavBar handleLogin={handleLogin} handleLogout={handleLogout} />}
      {/* Envuelve tus rutas en un div que pueda expandirse para empujar el Footer hacia abajo */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage handleLogin={handleLogin} />} />
          {isAuthenticated && (
            <>
              <Route path="/games" element={<Games />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/play" element={<Play />} />
            </>
          )}
          {/* Estas rutas deben ser accesibles sin importar el estado de autenticación */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {!isAuthenticated && <Route path="*" element={<Navigate replace to="/" />} />}
        </Routes>
      </div>
      {isSessionTimeOver && <SessionDialog open={isSessionTimeOver} onLogin={handleLogin} onLogout={handleLogout} />}
      {!isEditorPage && <Footer />}
    </div>
  );
}

export default App;
