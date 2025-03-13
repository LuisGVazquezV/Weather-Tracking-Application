export const getThemeConfig = (mode) => ({
    palette: {
        mode,
        ...(mode === 'dark' ? {
            // Dark mode colors
            primary: {
                main: '#90caf9',
            },
            secondary: {
                main: '#ce93d8',
            },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
        } : {
            // Light mode colors
            primary: {
                main: '#1976d2',
            },
            secondary: {
                main: '#9c27b0',
            },
        }),
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                    transition: 'background-color 0.3s ease-in-out',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? '#1e1e1e' : '#1976d2',
                    transition: 'background-color 0.3s ease-in-out',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.3s ease-in-out',
                },
            },
        },
    },
}); 