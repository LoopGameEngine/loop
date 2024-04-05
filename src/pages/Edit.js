import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { useTheme } from '@mui/material/styles';

function Edit() {
  const { gameID, token, API_KEY, DISCOVERY_DOCS, gameList, setGameList } = useAppContext();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [iframeInitialized, setIframeInitialized] = useState(false);
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
      setIsIframeLoaded(false); // Resetear el estado de carga del iframe al cerrar el editor
      setIframeInitialized(false); // Restablecer a false para permitir una nueva inicialización si se vuelve a abrir el editor
      navigate('/games');
    }
  }, [navigate, gameList, setGameList]);

  useEffect(() => {
    window.addEventListener('message', handleCloseEditor);
    return () => {
      window.removeEventListener('message', handleCloseEditor);
    };
  }, [handleCloseEditor]);

  useEffect(() => {
    const currentIframe = iframeRef.current;
    if (currentIframe) {
      currentIframe.onload = () => {
        setIsIframeLoaded(true); // Marcar el iframe como cargado
      };
    }
  }, []); // Este efecto se ejecuta una sola vez al montar

  useEffect(() => {
    // Envía el mensaje inicial o de actualización al iframe según corresponda
    if (isIframeLoaded && token) {
      let messageData;
      if (!iframeInitialized) {
        // Mensaje de inicialización inicial
        messageData = {
          type: 'initEditor',
          data: { gameID, token, API_KEY, DISCOVERY_DOCS },
        };
        setIframeInitialized(true); // Marcar el iframe como inicializado
      } else {
        // Mensaje de actualización de token
        messageData = {
          type: 'updateToken',
          data: { token },
        };
      }
      iframeRef.current.contentWindow.postMessage(messageData, window.location.origin);
    }
  }, [gameID, token, API_KEY, DISCOVERY_DOCS, isIframeLoaded, iframeInitialized]);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: theme.palette.primary.main }}>
      <iframe
        title="Editor"
        id="editorIframe"
        ref={iframeRef}
        src="/editor/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
      ></iframe>
    </div>
  );
}

export default Edit;



