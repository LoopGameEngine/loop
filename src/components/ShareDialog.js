import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Snackbar,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ShareDialog = ({ open, onClose, gameName, gameID, handleShareGame, handleUnshareGame, handleShareToggle, isShared }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [newSharedState, setNewSharedState] = useState(isShared);

  useEffect(() => {
    if (open) {
      setNewSharedState(isShared); // Reset the local state when the dialog opens
    }
  }, [open, isShared]);

  const handleToggleShare = () => {
    setNewSharedState(!newSharedState);
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setSnackbarMessage('Link copied to clipboard!');
      setSnackbarOpen(true);
    });
  };

  const handleDone = () => {
    if (newSharedState !== isShared) {
      if (newSharedState) {
        handleShareGame();
      } else {
        handleUnshareGame();
      }
      handleShareToggle(newSharedState);
    }
    setSnackbarOpen(false);
    onClose();
  };

  const server = window.location.hostname === 'lvh.me' ? 'https://play.lvh.me:3000' : 'https://play.loop2d.com';

  return (
    <Dialog open={open} onClose={onClose} onBackdropClick={onClose}>
      <DialogTitle>{`Share "${gameName}"`}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you want to make the game public so that it can be copied or played?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <FormControlLabel
            control={<Switch checked={newSharedState} onChange={handleToggleShare} />}
            label="Public"
          />
        </Box>
        <TextField
          fullWidth
          margin="dense"
          label="Link to Play the Game"
          value={newSharedState ? `${server}/${gameID}` : ''}
          disabled={!newSharedState}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => handleCopy(`${server}/${gameID}`)} disabled={!newSharedState}>
                <ContentCopyIcon />
              </IconButton>
            )
          }}
        />
        <TextField
          fullWidth
          margin="dense"
          label="ID to Copy the Game"
          value={newSharedState ? `${gameID}` : ''}
          disabled={!newSharedState}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => handleCopy(`${gameID}`)} disabled={!newSharedState}>
                <ContentCopyIcon />
              </IconButton>
            )
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDone}>Done</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Dialog>
  );
};

export default ShareDialog;




