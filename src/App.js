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
  const { setToken, setUserInfo, setLoopFolderID, setGameList, setUpdateGameList,
    expirationTimestamp, setExpirationTimestamp, isSessionActive, setIsSessionActive,
    CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();


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
    setIsSessionActive(true);
    await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
    const newToken = await login();
    if (location.pathname === '/') navigate('/games');
    setToken(newToken);
    const expiresIn = newToken.expires_in - 300; // five minutes less
    // const expiresIn = 10;
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
      {!isEditorPage && <NavBar handleLogin={handleLogin} handleLogout={handleLogout} />}
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
          <Route path="/play/:gameId" element={<Play />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {!isSessionActive && <Route path="*" element={<Navigate replace to="/" />} />}
        </Routes>
      </div>
      {isSessionActive && <SessionDialog open={!isSessionActive} onLogin={handleLogin} onClose={handleLogout} />}
      {!isEditorPage && <Footer />}
    </div>
  );
}

export default App;
