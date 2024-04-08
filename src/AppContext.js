// AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [appFolderID, setAppFolderID] = useState(null);
    const [gameList, setGameList] = useState([]);
    const [updateGameList, setUpdateGameList] = useState(true);
    const [gameID, setGameID] = useState(null);
    const [expirationTimestamp, setExpirationTimestamp] = useState(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const API_KEY = process.env.REACT_APP_API_KEY;
    const DISCOVERY_DOCS = process.env.REACT_APP_DISCOVERY_DOCS.split(' ');
    const SCOPES = process.env.REACT_APP_SCOPES;

    return (
        <AppContext.Provider value={{
            token, setToken,
            userInfo, setUserInfo,
            appFolderID, setAppFolderID,
            gameList, setGameList,
            updateGameList, setUpdateGameList,
            gameID, setGameID,
            expirationTimestamp, setExpirationTimestamp,
            isSessionActive, setIsSessionActive,
            CLIENT_ID,
            API_KEY,
            DISCOVERY_DOCS,
            SCOPES
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);


