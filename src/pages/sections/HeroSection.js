import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import BackgroundImage from '../../images/hero.gif';
import GameEngineLogo from '../../images/loop.png';

const HeroSection = ({ handleLogin }) => {
  const theme = useTheme();
  const styles = theme.heroSection;

  return (
    <Box sx={{ ...styles.heroContainer, backgroundImage: `url(${BackgroundImage})`, padding: '40px' }}>
      <Box sx={styles.overlay}></Box>
      <Box sx={styles.content} style={{ maxWidth: '500px', textAlign: 'center' }}>
        <img src={GameEngineLogo} alt="Game Engine Logo" style={{ ...styles.logo, maxWidth: '100%' }} />
        <Typography variant="h2" component="h1" sx={styles.title}>
          Build Your Own 2D Games Easily
        </Typography>
        <Typography variant="h5" component="p" sx={styles.subtitle}>
          The simplest game engine in the world, completely free and open source.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={styles.startButton}
          onClick={handleLogin}
          style={{ display: 'block', margin: '40px auto auto' }}
        >
          Start Now
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
