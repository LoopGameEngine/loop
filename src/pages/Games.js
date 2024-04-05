// Games.js
import React, { useEffect, useState, useCallback } from 'react';
import { newGame, deleteGame, duplicateGame, listDriveGames } from '../apis/driveAPI';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import GameCard from '../components/GameCard';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const { token, appFolderID, gameList, setGameList, setGameID, updateGameList, setUpdateGameList } = useAppContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const newUpdatedGameList = await listDriveGames(appFolderID);
      setGameList(newUpdatedGameList);
      setUpdateGameList(false);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  }, [appFolderID, setGameList, setUpdateGameList]);

  useEffect(() => {
    if (updateGameList) fetchGames();
  }, [updateGameList, fetchGames]);

  const handleAction = async (action, ...args) => {
    try {
      setLoading(true);
      if (action === deleteGame) {
        const confirmed = window.confirm('Are you sure you want to delete this game?');
        if (!confirmed) {
          return setLoading(false);
        }
      }
      await action(...args);
      setUpdateGameList(true);
    } catch (error) {
      console.error('Error performing game operation:', error.message);
    }
  };

  const handleNavigation = (path, gameID) => {
    setGameID(gameID);
    navigate(`/${path}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            width: '100%',
            height: 'calc(100vh - 64px - 106.5px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={80} />
        </Box>
      )}
      <div style={{ padding: '64px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleAction(newGame, appFolderID, token.access_token)}
            disabled={loading}
          >
            New Game
          </Button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 240px)', // Tarjetas de 200px de ancho
          gap: '16px', // Espacio entre tarjetas
          justifyContent: 'center', // Centra las tarjetas en el contenedor
          padding: '64px', // Ajusta el padding según sea necesario
        }}>
          {gameList.map((game) => (
            <GameCard key={game.id} game={game}
              handleEditGame={() => handleNavigation('edit', game.id)}
              handlePlayGame={() => handleNavigation('play', game.id)}
              handleDuplicateGame={() => handleAction(duplicateGame, game.id)}
              handleDeleteGame={() => handleAction(deleteGame, game.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
