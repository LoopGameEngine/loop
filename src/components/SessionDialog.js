// SessionDialog.js
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const SessionDialog = ({ open, onLogin, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Your session has expired</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Would you like to log in again?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onLogin}>Login</Button>
      <Button onClick={onClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default SessionDialog;