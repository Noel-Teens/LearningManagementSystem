import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../shared/api/axios';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Google Fonts mapping
const fontFamilyMap = {
    'Inter, sans-serif': "'Inter', system-ui, sans-serif",
    'Roboto, sans-serif': "'Roboto', system-ui, sans-serif",
    'Open Sans, sans-serif': "'Open Sans', system-ui, sans-serif",
    'Poppins, sans-serif': "'Poppins', system-ui, sans-serif",
};

// Load Google Font dynamically
const loadGoogleFont = (fontFamily) => {
    const fontName = fontFamily.split(',')[0].trim().replace(/'/g, '');
    const linkId = `google-font-${fontName.toLowerCase().replace(/\s/g, '-')}`;

    if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s/g, '+')}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
    }
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        mode: 'light',
        fontFamily: 'Inter, sans-serif',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTheme();
    }, []);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        // Apply dark mode class
        if (theme.mode === 'dark') {
            root.classList.add('dark');
            body.classList.add('dark-mode');
        } else {
            root.classList.remove('dark');
            body.classList.remove('dark-mode');
        }

        // Load and apply font family
        const mappedFont = fontFamilyMap[theme.fontFamily] || theme.fontFamily;
        loadGoogleFont(mappedFont);

        // Apply font to root and body
        root.style.fontFamily = mappedFont;
        body.style.fontFamily = mappedFont;

        // Set CSS variable for components that need it
        root.style.setProperty('--font-family', mappedFont);
    }, [theme]);

    const fetchTheme = async () => {
        try {
            const response = await api.get('/organizations');
            if (response.data.data && response.data.data.length > 0) {
                const org = response.data.data[0];
                if (org.theme) {
                    setTheme({
                        mode: org.theme.mode || 'light',
                        fontFamily: org.theme.fontFamily || 'Inter, sans-serif',
                    });
                }
            }
        } catch (error) {
            console.log('Could not fetch theme, using defaults');
        } finally {
            setLoading(false);
        }
    };

    const updateTheme = (newTheme) => {
        setTheme(prev => ({ ...prev, ...newTheme }));
    };

    const toggleMode = () => {
        setTheme(prev => ({
            ...prev,
            mode: prev.mode === 'light' ? 'dark' : 'light',
        }));
    };

    // Memoize style objects for performance
    const styles = useMemo(() => ({
        // Background colors
        bgPrimary: theme.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
        bgSecondary: theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white',
        bgCard: theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white',
        bgInput: theme.mode === 'dark' ? 'bg-gray-700' : 'bg-white',
        bgHover: theme.mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100',

        // Text colors
        textPrimary: theme.mode === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600',
        textMuted: theme.mode === 'dark' ? 'text-gray-400' : 'text-gray-500',

        // Border colors
        borderPrimary: theme.mode === 'dark' ? 'border-gray-700' : 'border-gray-200',
        borderSecondary: theme.mode === 'dark' ? 'border-gray-600' : 'border-gray-300',

        // Special
        sidebar: theme.mode === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
        header: theme.mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    }), [theme.mode]);

    const value = {
        theme,
        loading,
        updateTheme,
        toggleMode,
        refreshTheme: fetchTheme,
        isDark: theme.mode === 'dark',
        styles,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
