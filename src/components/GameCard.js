import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleOutline';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import LinkIcon from '@mui/icons-material/Link';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const GameCard = ({ game, handleEditGame, handlePlayGame, handleDuplicateGame, handleDeleteGame, handleShareGame, handleUnshareGame }) => {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [gameLink, setGameLink] = useState('');
    const [isShared, setIsShared] = useState(false);
    const [isMouseOver, setIsMouseOver] = useState(false);

    const openLinkDialog = () => {
        setIsLinkDialogOpen(true);
        // Aquí puedes obtener el enlace del juego y establecerlo en gameLink
    };

    const closeLinkDialog = () => {
        setIsLinkDialogOpen(false);
    };

    const toggleShare = () => {
        setIsShared(!isShared);
        if (isShared) handleUnshareGame(game.id, game.name);
        else handleShareGame(game.id, game.name);
    };

    return (
        <Card
            style={{ maxWidth: '240px', minWidth: '240px', userSelect: 'none' }}
            onMouseOver={() => setIsMouseOver(true)}
            onMouseOut={() => setIsMouseOver(false)}
        >
            <div style={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    alt={game.name}
                    height="140"
                    image={game.imageUrl}
                    style={{ objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                    onClick={() => handlePlayGame(game.id)}
                />
                {isMouseOver && (
                    <IconButton
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        onClick={() => handlePlayGame(game.id)}
                    >
                        <PlayCircleFilledIcon style={{ fontSize: '4rem' }} />
                    </IconButton>
                )}
            </div>
            <CardContent>
                <Typography>
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
                    <IconButton onClick={() => handleDuplicateGame(game.id)}>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete game">
                    <IconButton onClick={() => handleDeleteGame(game.id, game.name)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                {isShared ? (
                    <Tooltip title="Stop sharing">
                        <IconButton onClick={toggleShare}>
                            <GroupRemoveIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Share game">
                        <IconButton onClick={toggleShare}>
                            <GroupAddIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {isShared && (
                    <Tooltip title="Copy game link">
                        <IconButton onClick={openLinkDialog}>
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </CardActions>
            <Dialog open={isLinkDialogOpen} onClose={closeLinkDialog}>
                <DialogTitle>Game Link</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Game Link"
                        value={gameLink}
                        InputProps={{ readOnly: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeLinkDialog}>Close</Button>
                    <Button onClick={closeLinkDialog}>Copy Link</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default GameCard;

