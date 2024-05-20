import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useAppContext } from '../AppContext';

function Play() {
    const { gameID, token, API_KEY, DISCOVERY_DOCS } = useAppContext();
    const navigate = useNavigate();
    const iframeRef = useRef(null);
    const originalCanvasSize = useRef({ width: '', height: '' });

    const handleCloseEngine = useCallback(() => {
        navigate('/games');
    }, [navigate]);

    const handleOpenEngine = useCallback(() => {
        if (iframeRef.current) {
            const messageData = {
                type: 'playGame',
                data: { gameID, token, API_KEY, DISCOVERY_DOCS, fullscreen: false }
            };
            iframeRef.current.contentWindow.postMessage(messageData, window.location.origin);
        }
    }, [gameID, token, API_KEY, DISCOVERY_DOCS]);

    const handleFullscreen = useCallback(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const requestFullscreen = iframe.requestFullscreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullscreen || iframe.msRequestFullscreen;

            if (requestFullscreen) {
                // Save the original size of the canvas before going fullscreen
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                const canvas = iframeDocument.getElementById('canvas'); // Adjust the ID as needed
                if (canvas) {
                    originalCanvasSize.current.width = canvas.width;
                    originalCanvasSize.current.height = canvas.height;
                }

                requestFullscreen.call(iframe).then(() => {
                    // Adjust the canvas size within the iframe after entering fullscreen
                    if (canvas) {
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        canvas.style.objectFit = 'contain';
                    }
                }).catch(err => {
                    console.error('Error attempting to enable fullscreen mode:', err);
                });
            }
        }
    }, []);

    const restoreCanvasSize = useCallback(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const canvas = iframeDocument.getElementById('canvas'); // Adjust the ID as needed
            if (canvas && originalCanvasSize.current.width && originalCanvasSize.current.height) {
                canvas.style.width = `${originalCanvasSize.current.width}px`;
                canvas.style.height = `${originalCanvasSize.current.height}px`;
                canvas.style.objectFit = 'initial';
            }
        }
    }, []);

    useEffect(() => {
        const messageHandler = (event) => {
            if (event.origin !== window.location.origin) {
                return; // Ignore messages from other origins for security
            }

            if (event.data && event.data.type === "closeGame") {
                handleCloseEngine();
            }
        };

        window.addEventListener('message', messageHandler);

        // Event listener for exiting fullscreen mode
        const fullscreenChangeHandler = () => {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                restoreCanvasSize();
            }
        };

        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
        document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
        document.addEventListener('msfullscreenchange', fullscreenChangeHandler);

        return () => {
            window.removeEventListener('message', messageHandler);
            document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
            document.removeEventListener('msfullscreenchange', fullscreenChangeHandler);
        };
    }, [handleCloseEngine, restoreCanvasSize]);

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
            <IconButton
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '48px',
                    zIndex: 2,
                    color: 'white'
                }}
                onClick={handleFullscreen}
            >
                <FullscreenIcon />
            </IconButton>
            <iframe
                title="Game Engine"
                ref={iframeRef}
                id="game-iframe"
                onLoad={handleOpenEngine}
                src="/engine/"
                style={{
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    border: 'none',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            ></iframe>
            <style>
                {`
                #game-iframe {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #game-iframe #canvas {
                    max-width: 100%;
                    max-height: 100%;
                    width: auto;
                    height: auto;
                }
                `}
            </style>
        </div>
    );
}

export default Play;

