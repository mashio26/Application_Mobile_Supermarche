import { createContext, useState, useContext } from 'react'

const DarkModeContext = createContext();

export default function DarkModeProvider({ children }) {
    const lightTheme = {
        backgroundColor: '#8bffac',
        color: '#036',
    };

    const darkTheme = {
        backgroundColor: '#036',
        color: '#8bffac',
    };

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <DarkModeContext.Provider
        value={ {theme, darkMode, toggleDarkMode} }>
            {children}
        </DarkModeContext.Provider>
    );
}

export const useTheme = () => useContext(DarkModeContext);