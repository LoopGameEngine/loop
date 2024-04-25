import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel, TextField, Snackbar, IconButton, Typography, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ShareDialog = ({ open, onClose, gameName, handleShareGame, handleUnshareGame, handleShareToggle, isShared }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleToggleShare = () => {
    const newSharedState = !isShared;
    handleShareToggle(newSharedState);
    if (newSharedState) {
      handleShareGame(); // Actual sharing logic needs to be implemented
    } else {
      handleUnshareGame(); // Actual unsharing logic needs to be implemented
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setSnackbarMessage('Link copied to clipboard!');
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Share "${gameName}"`}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you want to make the game public so that it can be copied or played?
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <FormControlLabel
            control={<Switch checked={isShared} onChange={handleToggleShare} />}
            label="Public"
          />
        </Box>
        <TextField
          fullWidth
          margin="dense"
          label="Link to Play the Game"
          value={isShared ? `http://playgame.com/${gameName}` : ''}
          disabled={!isShared}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => handleCopy(`http://playgame.com/${gameName}`)} disabled={!isShared}>
                <ContentCopyIcon />
              </IconButton>
            )
          }}
        />
        <TextField
          fullWidth
          margin="dense"
          label="Link to Copy the Game"
          value={isShared ? `http://copygame.com/${gameName}` : ''}
          disabled={!isShared}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => handleCopy(`http://copygame.com/${gameName}`)} disabled={!isShared}>
                <ContentCopyIcon />
              </IconButton>
            )
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default ShareDialog;




