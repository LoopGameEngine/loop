import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const SessionDialog = ({ open, onLogin, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Session expired</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your session has expired. Please log in again to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onLogin} variant="contained" >
          Login
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionDialog;

