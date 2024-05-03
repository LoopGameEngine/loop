import React from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import loopLogo from '../images/loop.png';

function Login({ onLogin }) {
    const theme = useTheme();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: theme.palette.primary.main
        }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img src={loopLogo} alt="Loop Logo" style={{ width: 300 }} />
            </div>
            <Button
                variant="outlined"
                style={{ marginTop: '24px', color: 'white', borderColor: 'white' }}
                onClick={onLogin}
            >
                Login
            </Button>
        </div>
    );
}

export default Login;
