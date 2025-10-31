import React, { createContext, ReactNode, useEffect, useState } from 'react';
// FIX: The 'usePersistentState' hook was removed. Importing 'get' and 'set' helpers instead.
import { get, set } from '../hooks/usePersistentState';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // FIX: Replaced usePersistentState with standard useState and useEffect to manage theme persistence.
    const [theme, setTheme] = useState<Theme>('light');

    // On initial load, try to get the theme from persistent storage.
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await get<Theme>('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
        };
        loadTheme();
    }, []);

    // Whenever the theme changes, update the class on the root HTML element.
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            // Persist the new theme to storage.
            set('theme', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
