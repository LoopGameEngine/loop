import React from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button'; // Importa el componente Button de Material-UI
import loopLogo from './images/loop.png';
import { initGoogleAPI, login } from './apis/googleAPI';
import { useAppContext } from './AppContext';

function AppPlay() {
  const theme = useTheme();
  const { setToken, CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES } = useAppContext();

  const handleLogin = async () => {
    await initGoogleAPI(CLIENT_ID, API_KEY, DISCOVERY_DOCS, SCOPES);
    const newToken = await login();
    setToken(newToken);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: theme.palette.primary.main
    }}>
      <img src={loopLogo} alt="Loop Logo" style={{ width: 300, marginBottom: 20 }} />

      {/* Usa el componente Button con variant="outlined" y ajusta el color del texto y el borde */}
      <Button
        variant="outlined"
        style={{ marginTop: '24px', color: 'white', borderColor: 'white' }}
        onClick={handleLogin} // Agrega onClick para llamar a handleLogin al hacer clic
      >
        Login
      </Button>
    </div>
  );
}

export default AppPlay;




