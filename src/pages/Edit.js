import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { useTheme } from '@mui/material/styles';

function Edit() {
  const { gameID, token, API_KEY, DISCOVERY_DOCS, gameList, setGameList } = useAppContext();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [isIframeInitialized, setIsIframeInitialized] = useState(false);
  const theme = useTheme();

  const handleCloseEditor = useCallback((event) => {
    if (event.origin === window.location.origin && event.data && event.data.type === "closeEditor") {
      const updatedList = gameList.map(game => {
        if (game.id === event.data.data.id) {
          return { ...game, name: event.data.data.name };
        }
        return game;
      });
      setGameList(updatedList);
      setIsIframeLoaded(false);
      setIsIframeInitialized(false);
      navigate('/games');
    }
  }, [navigate, gameList, setGameList]);

  useEffect(() => {
    window.addEventListener('message', handleCloseEditor);
    return () => {
      window.removeEventListener('message', handleCloseEditor);
    };
  }, [handleCloseEditor]);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  useEffect(() => {
    if (isIframeLoaded && token && !isIframeInitialized) {
      const messageData = {
        type: 'initEditor',
        data: { gameID, token, API_KEY, DISCOVERY_DOCS },
      };
      iframeRef.current.contentWindow.postMessage(messageData, window.location.origin);
      setIsIframeInitialized(true);
    }
  }, [isIframeLoaded, token, isIframeInitialized, gameID, API_KEY, DISCOVERY_DOCS]);

  useEffect(() => {
    if (isIframeInitialized && token) {
      const messageData = {
        type: 'updateToken',
        data: { token },
      };
      iframeRef.current.contentWindow.postMessage(messageData, window.location.origin);
    }
  }, [token, isIframeInitialized]);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: theme.palette.primary.main }}>
      <iframe
        title="Editor"
        id="editorIframe"
        ref={iframeRef}
        src="/editor/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        onLoad={handleIframeLoad}
      ></iframe>
    </div>
  );
}

export default Edit;
