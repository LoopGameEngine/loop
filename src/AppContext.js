import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loopFolderID, setLoopFolderID] = useState(null);
    const [gameList, setGameList] = useState([]);
    const [gameID, setGameID] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_API_KEY;
    const DISCOVERY_DOCS = process.env.REACT_APP_DISCOVERY_DOCS.split(' ');
    const SCOPES = process.env.REACT_APP_SCOPES;

    return (
        <AppContext.Provider value={{
            CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES,
            token, setToken,
            userInfo, setUserInfo,

            loopFolderID, setLoopFolderID,
            gameList, setGameList,
            gameID, setGameID,

            isSessionActive, setIsSessionActive,
            timeRemaining, setTimeRemaining
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
