import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CopyGameDialog = ({ open, onClose, handleDuplicateGame }) => {

    const handleDuplicateButtonClick = () => {
        const gameIDToCopy = document.getElementById('gameIDTextField').value;
        handleDuplicateGame(gameIDToCopy, ""); // Pasar solo el gameID
        onClose(); 
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Copy Shared Game</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Game ID"
                    id="gameIDTextField"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDuplicateButtonClick} color="primary" variant="contained">Copy Game</Button>
                <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};


export default CopyGameDialog;




