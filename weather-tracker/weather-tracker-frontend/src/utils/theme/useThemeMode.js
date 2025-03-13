import { useState, useEffect } from 'react';

export const useThemeMode = () => {
    // Initialize theme based on local storage or system preference
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('theme-mode');
        if (savedMode) {
            return savedMode;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only update if there's no saved preference
            if (!localStorage.getItem('theme-mode')) {
                setMode(e.matches ? 'dark' : 'light');
            }
        };

        // Add listener for theme changes
        mediaQuery.addEventListener('change', handleChange);

        // Cleanup
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme-mode', newMode);
            return newMode;
        });
    };

    return {
        mode,
        toggleColorMode,
    };
}; 