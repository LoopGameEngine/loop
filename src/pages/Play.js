import React, { useRef, useCallback, useState } from 'react';
import { useAppContext } from '../AppContext';
import MadeWith from './sections/MadeWith';

function Play() {
    const { gameID, token, API_KEY, DISCOVERY_DOCS } = useAppContext();
    const iframeRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleOpenEngine = useCallback(() => {
        if (iframeRef.current) {
            const messageData = {
                type: 'playGame',
                data: { gameID, token, API_KEY, DISCOVERY_DOCS, fullscreen: true }
            };
            iframeRef.current.contentWindow.postMessage(messageData, '*');
        }
    }, [gameID, token, API_KEY, DISCOVERY_DOCS]);

    const requestFullscreen = () => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
        setIsFullscreen(true);
    };

    const startGame = (fullscreen) => {
        if (fullscreen) {
            requestFullscreen();
        } else {
            setIsFullscreen(true);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#353535' }}>
            {isFullscreen ? (
                <iframe
                    title="Game Engine"
                    ref={iframeRef}
                    id="game-iframe"
                    onLoad={handleOpenEngine}
                    src="/engine/"
                    style={{
                        width: '100vw',
                        height: '100vh',
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                ></iframe>
            ) : (
                <MadeWith
                    onFullscreen={() => startGame(true)}
                    onWindowed={() => startGame(false)}
                />
            )}
        </div>
    );
}

export default Play;
