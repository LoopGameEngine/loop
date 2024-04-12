import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { listFilesInFolder } from '../apis/driveAPI';

const PlayTest = () => {
    const { gameId } = useParams();  // Cambiado para recibir gameId
    const { userInfo, token } = useAppContext();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Token:", token);
        console.log("Game ID:", gameId);
    
        if (token && gameId) {
            listFilesInFolder(gameId)
                .then(result => {
                    setFiles(result.files);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching files:', err);
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            setError('Token or Game ID is missing');
            setLoading(false);
        }
    }, [token, gameId]);  // Asegúrate de que gameId es la variable correcta usada
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>PlayTest Page</h1>
            <p>User Info: {JSON.stringify(userInfo)}</p>
            <ul>
                {files.map(file => (
                    <li key={file.id}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default PlayTest;
