import React, { createContext, useState, useContext } from 'react';
import { Appearance, useColorScheme } from 'react-native';

export const ThemeContext = createContext();

const themes = {
    light: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        inputBackgroundColor: '#f5f5f5',
        inputTextColor: '#000000',
        buttonBackgroundColor: '#007bff',
        buttonTextColor: '#ffffff',
        colorButtonBackgroundColor: '#ddd',
    },
    night: {
        backgroundColor: '#1c1c1c',
        textColor: '#ffffff',
        inputBackgroundColor: '#333333',
        inputTextColor: '#ffffff',
        buttonBackgroundColor: '#1c1c1c',
        buttonTextColor: '#ffffff',
        colorButtonBackgroundColor: '#555555',
    },
};

export const ThemeProvider = ({ children }) => {
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme === 'dark' ? themes.night : themes.light);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === themes.light ? themes.night : themes.light));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
