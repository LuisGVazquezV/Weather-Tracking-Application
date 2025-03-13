import { createContext, useContext } from 'react';
import { useThemeMode } from './useThemeMode';

const ThemeContext = createContext(null);

export const ThemeContextProvider = ({ children }) => {
    const themeMode = useThemeMode();

    return (
        <ThemeContext.Provider value={themeMode}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeContextProvider');
    }
    return context;
}; 