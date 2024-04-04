// GameCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

const GameCard = ({ game, handleEditGame, handlePlayGame, handleDuplicateGame, handleDeleteGame }) => (
    <Card style={{ maxWidth: '240px', minWidth: '240px', userSelect: 'none' }}>
        <CardMedia
            component="img"
            alt={game.name}
            height="140"
            image={game.imageUrl}
            style={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
        />
        <CardContent>
            <Typography>
                {game.name}
            </Typography>
        </CardContent>
        {/* Acciones de la tarjeta */}
        <CardActions>
            <Tooltip title="Edit game">
                <IconButton onClick={() => handleEditGame(game.id)}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Play game">
                <IconButton onClick={() => handlePlayGame(game.id)}>
                    <PlayCircleFilledIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Duplicate game">
                <IconButton onClick={() => handleDuplicateGame(game.id)}>
                    <FileCopyIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete game">
                <IconButton onClick={() => handleDeleteGame(game.id, game.name)}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </CardActions>
    </Card>
);

export default GameCard;
