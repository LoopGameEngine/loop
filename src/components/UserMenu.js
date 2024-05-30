import React from 'react';
import { Menu, MenuItem, Avatar, Typography, Divider, ListItemIcon } from '@mui/material';
import GamesIcon from '@mui/icons-material/SportsEsports';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppContext } from '../AppContext';

const UserMenu = ({ userInfo, onMyGamesClick, onLogoutClick, anchorEl, onClose }) => {
  const { timeRemaining } = useAppContext();
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  const sessionTimeDisplay = minutes <= 0 && seconds <= 0
    ? "Session is Over"
    : `Session Time: ${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <>
      {userInfo ? (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onClose}
        >
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <Avatar alt={userInfo.name} src={userInfo.picture} sx={{ margin: 'auto', width: 124, height: 124 }} />
            <Typography variant="body1" sx={{ marginTop: 1, fontWeight: 'bold' }}>{userInfo.name}</Typography>
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {sessionTimeDisplay}
            </Typography>
          </div>
          <Divider />
          <MenuItem onClick={onMyGamesClick}>
            <ListItemIcon>
              <GamesIcon />
            </ListItemIcon>
            My Games
          </MenuItem>
          <MenuItem onClick={onLogoutClick}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      ) : null}
    </>
  );
};

export default UserMenu;
