import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import { getThemeConfig } from './themeConfig';
import { useThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
    const { mode } = useThemeContext();

    const theme = useMemo(
        () => createTheme(getThemeConfig(mode)),
        [mode]
    );

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </MuiThemeProvider>
    );
}; 