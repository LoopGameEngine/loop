// play.js
import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../AppContext';

function Play() {
    const { gameID: urlGameID } = useParams();
    const { gameID: contextGameID, token, API_KEY, DISCOVERY_DOCS } = useAppContext();

    const gameID = urlGameID || contextGameID;

    const navigate = useNavigate();
    const iframeRef = useRef(null);

    const handleCloseEngine = useCallback(() => {
        navigate('/games');
    }, [navigate]);

    const handleOpenEngine = useCallback(() => {
        if (iframeRef.current) {
            const messageData = {
                type: 'playGame',
                data: { gameID, token, API_KEY, DISCOVERY_DOCS }
            };
            iframeRef.current.contentWindow.postMessage(messageData, '*');
        }
    }, [gameID, token, API_KEY, DISCOVERY_DOCS]);

    useEffect(() => {
        const messageHandler = (event) => {
            if (event.data && event.data.type === "closeGame") {
                handleCloseEngine();
            }
        };

        window.addEventListener('message', messageHandler);

        return () => {
            window.removeEventListener('message', messageHandler);
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
