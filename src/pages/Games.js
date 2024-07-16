import React, { useEffect, useState, useCallback } from 'react';
import { listDriveGames, createGame, duplicateGame, deleteGame, shareGame, unshareGame } from '../apis/driveAPI';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GameCard from '../components/GameCard';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import CopyGameDialog from '../components/CopyGameDialog';

const Games = () => {
  const { loopFolderID, gameList, setGameList, setGameID } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const navigate = useNavigate();
  const [showFile, setShowFile] = useState('');

  const updateGameList = useCallback(async () => {
    try {
      setLoading(true);
      const newUpdatedGameList = await listDriveGames(loopFolderID);
      setGameList(newUpdatedGameList);
    } catch (error) {
      console.error('Error updating game list:', error);
    } finally {
      setLoading(false);
    }
  }, [loopFolderID, setGameList]);

  useEffect(() => {
    if (gameList === null) {
      updateGameList();
    }
  }, [gameList, updateGameList]);

  const handleShowFile = useCallback((fileName) => {
    setShowFile(fileName);
  }, []);

  const handleAction = async (action, ...args) => {
    try {
      setLoading(true);
      const gameName = args[args.length - 1];
      let actionName = action.name.replace(/Game/g, '').replace(/([A-Z])/g, ' $1').toLowerCase().trim();
      if (!actionName.includes('share')) {
        let confirmationMessage = `Are you sure you want to ${actionName} ${gameName}?`;
        const confirmed = window.confirm(confirmationMessage);
        if (!confirmed) return setLoading(false);
      }
      await action(...args);
      updateGameList();
      setShowFile('');
    } catch (error) {
      console.error('Error performing game operation:', error.message);
      setLoading(false);
    }
  };

  const handleNavigation = (path, gameID) => {
    setGameID(gameID);
    navigate(`/${path}`);
  };

  const handleCopyGameDialogOpen = () => {
    setShowCopyDialog(true);
  };

  const handleCopyGameDialogClose = () => {
    setShowCopyDialog(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'fixed', width: '100%', height: '100%',
            top: 0, bottom: 0, zIndex: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          }}
        >
          <CircularProgress size={80} />
          {showFile && (
            <Typography
              sx={{ mt: 2, fontSize: '1.25rem' }}>
              {showFile}
            </Typography>
          )}
        </Box>
      )}
      <div style={{ padding: '64px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleAction(createGame, loopFolderID, "a new game")}
            disabled={loading}
            style={{ marginBottom: '16px', marginRight: '16px' }}
          >
            New Game
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyGameDialogOpen}
            disabled={loading}
            style={{ marginBottom: '16px' }}
          >
            Copy Game
          </Button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 240px)',
          gap: '24px',
          justifyContent: 'center',
        }}>
          {gameList && gameList.length > 0 ? (
            gameList.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                handleEditGame={() => handleNavigation('edit', game.id)}
                handlePlayGame={() => handleNavigation('play', game.id)}
                handleDuplicateGame={() => handleAction(duplicateGame, handleShowFile, loopFolderID, game.id, game.name)}
                handleDeleteGame={() => handleAction(deleteGame, game.id, game.name)}
                handleShareGame={() => handleAction(shareGame, game.id, game.name)}
                handleUnshareGame={() => handleAction(unshareGame, game.id, game.name)}
              />
            ))
          ) : (
            <Typography variant="h6" color="textSecondary">No games available</Typography>
          )}
        </div>
      </div>
      <CopyGameDialog
        open={showCopyDialog}
        onClose={handleCopyGameDialogClose}
        handleDuplicateGame={(gameID) => handleAction(duplicateGame, handleShowFile, loopFolderID, gameID, "Shared Game")}
      />
    </div>
  );
};

export default Games;
