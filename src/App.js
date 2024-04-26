import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { getUserInfo, initGoogleAPI, login, logout } from './apis/googleAPI';
import { folderExists, createFolder } from './apis/driveAPI';
import NavBar from './components/NavBar';
import LandingPage from './pages/LandingPage';
import Games from './pages/Games';
import Edit from './pages/Edit';
import Play from './pages/Play';
import Legal from './pages/Legal';
import Login from './pages/Login';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Footer from './components/Footer';
import SessionDialog from './components/SessionDialog';
import { useAppContext } from './AppContext';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFullPage = location.pathname === '/edit' || location.pathname === '/login' || location.pathname.match(/^\/play\/.+$/);
  const { setGameID, setToken, setUserInfo, setLoopFolderID, setGameList, setUpdateGameList,
    expirationTimestamp, setExpirationTimestamp, isSessionActive, setIsSessionActive,
    CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();
  const { pathname } = location;
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);

  useEffect(() => {
    const checkSession = setInterval(() => {
      const currentTime = new Date().getTime();
      if (expirationTimestamp && currentTime >= expirationTimestamp) {
        console.log('La sesión ha expirado');
        setIsSessionActive(false);
        clearInterval(checkSession);
      }
    }, 1000);
    return () => clearInterval(checkSession);
  }, [expirationTimestamp, setIsSessionActive]);

  const handleLogin = async () => {
    setIsSessionDialogOpen(false);
    await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
    const newToken = await login();
    if (!isSessionActive) {
      console.log(pathname);
      if (pathname.match(/^\/play\/.+$/)) {
        const gameId = pathname.split('/').pop();
        setGameID(gameId);
        navigate(`/play/`);
      } else {
        navigate('/games');
      }
    }
    setIsSessionActive(true);
    setToken(newToken);
    let expiresIn = newToken.expires_in - 300; // five minutes less
    // expiresIn = 10;
    const expirationTimestamp = new Date().getTime() + expiresIn * 1000;
    setExpirationTimestamp(expirationTimestamp);
    let newFolderID = await folderExists("Loop");
    if (!newFolderID) {
      newFolderID = await createFolder("Loop", 'root');
    }
    setLoopFolderID(newFolderID);
    const newUserInfo = await getUserInfo(newToken.access_token);
    setUserInfo(newUserInfo);
    setUpdateGameList(true);
  };

  const handleLogout = async () => {
    console.log("logout");
    await logout();
    setToken(null);
    setUserInfo(null);
    setLoopFolderID(null);
    setGameList([]);
    setIsSessionActive(false);
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Renderizar NavBar solo si no es una página de pantalla completa */}
      {!isFullPage && <NavBar handleLogin={handleLogin} handleLogout={handleLogout} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage handleLogin={handleLogin} />} />
          {isSessionActive && (
            <>
              <Route path="/games" element={<Games />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/play" element={<Play />} />
            </>
          )}
          {/* Renderizar la página Login */}
          <Route path="/play/:gameID" element={<Login handleLogin={handleLogin} />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {!isSessionActive && <Route path="*" element={<Navigate replace to="/" />} />}
        </Routes>
      </div>
      {/* Renderizar Footer solo si no es una página de pantalla completa */}
      {!isFullPage && <Footer />}
      {!isSessionActive && isSessionDialogOpen && (
        <SessionDialog open={true} onLogin={handleLogin} onClose={() => setIsSessionDialogOpen(false)} />
      )}
    </div>
  );
}

export default App;

