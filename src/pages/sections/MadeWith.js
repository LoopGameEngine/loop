import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import loopLogo from '../../images/loop.png';

const FullscreenButton = styled(Button)({
    border: '2px solid white',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    margin: '10px'
});

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

const Logo = styled('img')({
    width: '240px',
    margin: '20px'
});

const MadeWith = ({ onFullscreen, onWindowed }) => (
    <Container>
        <Typography variant="h3">Made with</Typography>
        <Logo src={loopLogo} alt="Loop Logo" />
        <Typography variant="h6" style={{ marginBottom: '20px' }}>
            How do you want to play?
        </Typography>
        <FullscreenButton variant="outlined" onClick={onFullscreen}>
            FULLSCREEN
        </FullscreenButton>
        <FullscreenButton variant="outlined" onClick={onWindowed}>
            WINDOWED
        </FullscreenButton>
    </Container>
);

export default MadeWith;
