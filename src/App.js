import React, { useEffect, useState, useCallback } from 'react';
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
  const isFullPage = location.pathname === '/edit';
  const isHome = location.pathname === '/';
  const {
    setToken, setUserInfo, setLoopFolderID, setGameList,
    isSessionActive, setIsSessionActive, setTimeRemaining, CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES
  } = useAppContext();
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [expirationTimestamp, setExpirationTimestamp] = useState(null);

  useEffect(() => {
    const checkSession = setInterval(() => {
      const currentTime = new Date().getTime();
      if (expirationTimestamp) {
        const timeLeft = expirationTimestamp - currentTime;
        setTimeRemaining(timeLeft);

        if (timeLeft <= 0 && isSessionActive) {
          setSessionDialogOpen(true);
          clearInterval(checkSession);
        }
      }
    }, 1000);

    return () => clearInterval(checkSession);
  }, [expirationTimestamp, isSessionActive, setTimeRemaining]);

  const handleLogin = useCallback(async () => {
    setSessionDialogOpen(false);
    await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
    const newToken = await login();
    setIsSessionActive(true);
    setToken(newToken);

    let expiresIn = newToken.expires_in;
    //expiresIn = 20; // En producción, quita esta línea
    const expirationTimestamp = new Date().getTime() + expiresIn * 1000;
    setExpirationTimestamp(expirationTimestamp);
    let newFolderID = await folderExists("Loop");
    if (!newFolderID) {
      newFolderID = await createFolder("Loop", 'root');
    }
    setLoopFolderID(newFolderID);
    const newUserInfo = await getUserInfo(newToken.access_token);
    setUserInfo(newUserInfo);
    if (isHome) navigate('/games');
  }, [
    CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES,
    setIsSessionActive, setToken, setExpirationTimestamp,
    setLoopFolderID, setUserInfo, isHome, navigate
  ]);

  const handleLogout = useCallback(async () => {
    await logout();
    setToken(null);
    setUserInfo(null);
    setLoopFolderID(null);
    setGameList([]);
    setIsSessionActive(false);
    setSessionDialogOpen(false);
    navigate('/');
  }, [navigate, setToken, setUserInfo, setLoopFolderID, setGameList, setIsSessionActive]);

  const handleCloseDialog = useCallback(() => {
    setSessionDialogOpen(false);
    handleLogout();
  }, [handleLogout]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isFullPage && (
        <NavBar
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<LandingPage handleLogin={handleLogin} />} />
          <Route path="/games" element={isSessionActive ? <Games /> : <Navigate to="/" />} />
          <Route path="/edit" element={isSessionActive ? <Edit /> : <Navigate to="/" />} />
          <Route path="/play" element={isSessionActive ? <Play /> : <Navigate to="/" />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isFullPage && <Footer />}
      {sessionDialogOpen && (
        <SessionDialog
          open={true}
          onLogin={handleLogin}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}

export default App;
