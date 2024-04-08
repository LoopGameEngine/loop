// Games.js
import React, { useEffect, useState, useCallback } from 'react';
import { createGame, deleteGame, duplicateGame, listDriveGames } from '../apis/driveAPI';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import GameCard from '../components/GameCard';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Games = () => {
  const { appFolderID, gameList, setGameList, setGameID, updateGameList, setUpdateGameList } = useAppContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGames = useCallback(async () => {
    try {
      const newUpdatedGameList = await listDriveGames(appFolderID);
      setGameList(newUpdatedGameList);
      setUpdateGameList(false);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally { setLoading(false) }
  }, [appFolderID, setGameList, setUpdateGameList]);

  useEffect(() => {
    if (updateGameList) fetchGames();
  }, [updateGameList, fetchGames]);

  const handleAction = async (action, ...args) => {
    try {
      setLoading(true);
      const gameName = args[args.length - 1];
      let actionName = action.name.replace(/Game/g, '').replace(/([A-Z])/g, ' $1').toLowerCase().trim();
      let confirmationMessage = `Are you sure you want to ${actionName} ${gameName}?`;
      const confirmed = window.confirm(confirmationMessage);
      if (!confirmed) return setLoading(false);
      await action(...args);
      setUpdateGameList(true);
    } catch (error) { console.error('Error performing game operation:', error.message); }
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
            position: 'fixed', width: '100%', height: '100%',
            top: 0, bottom: 0, zIndex: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
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
            onClick={() => handleAction(createGame, appFolderID, "a new game")}
            disabled={loading}
          >
            New Game
          </Button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 240px)',
          gap: '24px',
          justifyContent: 'center',
        }}>
          {gameList.map((game) => (
            <GameCard key={game.id} game={game}
              handleEditGame={() => handleNavigation('edit', game.id)}
              handlePlayGame={() => handleNavigation('play', game.id)}
              handleDuplicateGame={() => handleAction(duplicateGame, appFolderID, game.id, game.name)}
              handleDeleteGame={() => handleAction(deleteGame, game.id, game.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
