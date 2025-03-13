import { IconButton, Tooltip, Zoom } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from './ThemeContext';

export const ThemeToggle = () => {
    const { mode, toggleColorMode } = useThemeContext();

    return (
        <Zoom in={true}>
            <Tooltip
                title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                arrow
                placement="left"
            >
                <IconButton
                    onClick={toggleColorMode}
                    size="small"
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        bgcolor: 'background.paper',
                        width: 36,
                        height: 36,
                        boxShadow: 4,
                        zIndex: 9999,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'scale(1.1)',
                        },
                        '& .MuiSvgIcon-root': {
                            fontSize: 20,
                        },
                    }}
                    color="inherit"
                    aria-label="toggle theme"
                >
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Tooltip>
        </Zoom>
    );
}; 