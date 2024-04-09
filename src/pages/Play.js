// Play.js
import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../AppContext';

function Play() {
    const { gameID, token, API_KEY, DISCOVERY_DOCS } = useAppContext();
    const navigate = useNavigate();
    const iframeRef = useRef(null);

    const handleCloseEngine = useCallback(() => {
        navigate('/games');
    }, [navigate]);

    const handleOpenEngine = useCallback(() => {
        const messageData = {
            type: 'playGame',
            data: { gameID, token, API_KEY, DISCOVERY_DOCS }
        };
        iframeRef.current.contentWindow.postMessage(messageData, '*');
    }, [gameID, token, API_KEY, DISCOVERY_DOCS]);

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
                    flex: 1,
                    border: 'none',
                }} 
            ></iframe>
        </div>
    );
}

export default Play;
