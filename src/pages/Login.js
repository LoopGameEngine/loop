import React, { useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import loopLogo from '../images/loop.png'; // Importa la imagen del logo
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../AppContext';

const Login = ({ handleLogin }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { gameID } = useParams(); // Obtiene el gameID de los parámetros de la URL
    const { setGameID, isSessionActive } = useAppContext(); // Funciones y estado del contexto

    useEffect(() => {
        // Verifica si la sesión está activa y handleLogin ha terminado
        if (isSessionActive) {
            setGameID(gameID); // Establece el gameID en el contexto
            // Redirige a la página de Play con el gameID en la URL
            navigate(`/play/${gameID}`);
        }
    }, [isSessionActive, navigate, setGameID, gameID]);

    const handleLoginAndRedirect = async () => {
        await handleLogin(); // Ejecuta la función handleLogin
    };

    return (
        <div style={{ backgroundColor: theme.palette.primary.main, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box mb={2}>
                <img src={loopLogo} alt="Loop Logo" style={{ height: '6rem' }} />
            </Box>
            <Button variant='outlined' style={{ color: 'white', borderColor: 'white', marginTop: '24px' }} onClick={handleLoginAndRedirect} startIcon={<AccountCircleIcon />}>
                Login
            </Button>
        </div>
    );
};

export default Login;

