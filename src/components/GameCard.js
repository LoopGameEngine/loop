import React, { useState } from 'react';
import { Card, CardContent, CardActions, CardMedia, IconButton, Typography, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleOutline';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import GroupIcon from '@mui/icons-material/Group';
import ShareDialog from './ShareDialog';

const GameCard = ({ game, handleEditGame, handlePlayGame, handleDuplicateGame, handleDeleteGame, handleShareGame, handleUnshareGame }) => {
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [isShared, setIsShared] = useState(game.isShared);
    const [isMouseOver, setIsMouseOver] = useState(false);

    const openShareDialog = () => {
        setShareDialogOpen(true);
    };

    const closeShareDialog = () => {
        setShareDialogOpen(false);
        setIsMouseOver(false);
    };

    const handleShareToggle = (shared) => {
        setIsShared(shared);
    };

    return (
        <Card style={{ maxWidth: '240px', minWidth: '240px', userSelect: 'none' }}
            onMouseOver={() => setIsMouseOver(true)}
            onMouseOut={() => setIsMouseOver(false)}>
            <div style={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    alt={game.name}
                    height="140"
                    image={game.imageUrl}
                    style={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                    onClick={() => handlePlayGame(game.id)}
                />
                {isMouseOver && !shareDialogOpen && (
                    <IconButton
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        onClick={() => handlePlayGame(game.id)}
                    >
                        <PlayCircleFilledIcon style={{ fontSize: '4rem' }} />
                    </IconButton>
                )}
            </div>
            <CardContent>
                <Typography component="div">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{game.name}</span>
                        {isShared && <GroupIcon style={{ marginLeft: '4px', color: 'gray', verticalAlign: 'middle' }} />}
                    </div>
                </Typography>
            </CardContent>
            <CardActions>
                <Tooltip title="Edit game">
                    <IconButton onClick={() => handleEditGame(game.id)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate game">
                    <IconButton onClick={() => handleDuplicateGame(game.id, game.name)}>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete game">
                    <IconButton onClick={() => handleDeleteGame(game.id, game.name)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share game">
                    <IconButton onClick={openShareDialog}>
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <ShareDialog
                open={shareDialogOpen}
                onClose={closeShareDialog}
                gameName={game.name}
                handleShareGame={handleShareGame}
                handleUnshareGame={handleUnshareGame}
                handleShareToggle={handleShareToggle}
                isShared={isShared}
            />
        </Card>
    );
};

export default GameCard;
