import React, { useRef, useCallback } from 'react';
import { useAppContext } from '../AppContext';

function Play() {
    const { gameID, token, API_KEY, DISCOVERY_DOCS } = useAppContext();
    const iframeRef = useRef(null);

    const handleOpenEngine = useCallback((fullscreen) => {
        if (iframeRef.current) {
            const messageData = {
                type: 'playGame',
                data: { gameID, token, API_KEY, DISCOVERY_DOCS, fullscreen: true }
            };
            iframeRef.current.contentWindow.postMessage(messageData, '*');
        }
    }, [gameID, token, API_KEY, DISCOVERY_DOCS]);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: "hidden" }}>
            <iframe
                title="Game Engine"
                ref={iframeRef}
                id="game-iframe"
                onLoad={() => handleOpenEngine(false)}
                src="/engine/"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            ></iframe>
        </div>
    );
}

export default Play;


