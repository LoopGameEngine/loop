import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const SessionDialog = ({ open, onLogin, onClose }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Your session is about to expire</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Would you like to log in again?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onLogin} color="primary">Login</Button>
      <Button onClick={onClose} color="secondary">Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default SessionDialog;

