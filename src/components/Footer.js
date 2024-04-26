import React from 'react';
import { Box, Grid, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import DiscordIcon from './DiscordIcon';
import tikTokImage from '../images/tic-toc.png';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <div style={{ zIndex: 1000 }}>
      <Box
        component="footer"
        sx={{
          ...theme.customStyles.footer,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          py: 2,
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="YouTube">
                <IconButton color="inherit" component="a" href="https://youtube.com">
                  <YouTubeIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Discord">
                <IconButton color="inherit" component="a" href="https://discord.com">
                  <DiscordIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Instagram">
                <IconButton color="inherit" component="a" href="https://instagram.com">
                  <InstagramIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="TikTok">
                <IconButton color="inherit" component="a" href="https://tiktok.com">
                  <img src={tikTokImage} alt="TikTok" style={{ width: 21, height: 21 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Facebook">
                <IconButton color="inherit" component="a" href="https://facebook.com">
                  <FacebookIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography variant="subtitle1" gutterBottom>
              Copyright © {currentYear} Loop Game Engine
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', gap: 1 }}>
              <RouterLink to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>
                Terms of Use
              </RouterLink>
              |
              <RouterLink to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>
                Privacy Policy
              </RouterLink>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Footer;









