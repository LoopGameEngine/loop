import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../AppContext';

function PlayTest() {
    const { API_KEY, DISCOVERY_DOCS } = useAppContext();
    const navigate = useNavigate();
    const iframeRef = useRef(null);

    // Utiliza useParams para obtener gameID de la URL
    const { gameId } = useParams(); // Asegúrate de que la ruta está definida para recibir gameId

    const handleCloseEngine = useCallback(() => {
        navigate('/games');
    }, [navigate]);

    const handleOpenEngine = useCallback(() => {
        const messageData = {
            type: 'playGame',
            data: { gameID: gameId, API_KEY, DISCOVERY_DOCS } // Envía gameId obtenido de la URL
        };
        iframeRef.current.contentWindow.postMessage(messageData, '*');
    }, [gameId, API_KEY, DISCOVERY_DOCS]); // Añade gameId a las dependencias

    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === "closeGame") {
                handleCloseEngine();
            }
        });

        return () => {
            window.removeEventListener('message', handleCloseEngine);
        };
    }, [handleCloseEngine]);

    return (
        <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <IconButton
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 2,
                    color: 'white'
                }}
                onClick={handleCloseEngine}
            >
                <CloseIcon />
            </IconButton>
            <iframe
                title="Game Engine"
                ref={iframeRef}
                onLoad={handleOpenEngine}
                src="/engine/index.html"
                style={{
                    width: '100%',
                    height: '100%', // Asegurarse de que el iframe ocupe todo el espacio disponible
                    border: 'none',
                }} 
            ></iframe>
        </div>
    );
}

export default PlayTest;
