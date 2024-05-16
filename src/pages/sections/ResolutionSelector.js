import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#353535',
    color: 'white',
    textAlign: 'center',
});

const ResolutionSelector = ({ onFullscreen, onWindowed }) => (
    <Container>
        <Typography variant="h6" style={{ marginBottom: '20px' }}>
            How do you want to play?
        </Typography>
        <Button onClick={onFullscreen} style={{ marginTop: '24px', color: "#353535", backgroundColor: 'white' }}>
            FULLSCREEN
        </Button>
        <Button variant="outlined" onClick={onWindowed} style={{ marginTop: '24px', color: 'white', borderColor: 'white' }}>
            WINDOWED
        </Button>
    </Container>
);

export default ResolutionSelector;
