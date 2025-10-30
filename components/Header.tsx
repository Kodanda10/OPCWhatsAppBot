import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

interface HeaderProps {
    onAdminClick: () => void;
}

const ThemeToggleButton: React.FC = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('ThemeToggleButton must be used within a ThemeProvider');
    }
    const { theme, toggleTheme } = context;

    return (
        <button onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle Theme" className="focus:outline-none">
            {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ onAdminClick }) => {
    return (
        <header className="bg-[#075E54] dark:bg-gray-800 text-white p-3 flex items-center justify-between shadow-md z-10 flex-shrink-0">
            <div className="flex items-center">
                <i className="fas fa-arrow-left text-xl mr-4 cursor-pointer"></i>
            </div>
            <div className="flex items-center space-x-5 text-xl">
                <ThemeToggleButton />
                <i className="fas fa-search cursor-pointer"></i>
                <i className="fas fa-bell cursor-pointer"></i>
                <i title="Open CMS Panel" aria-label="Open CMS Panel" onClick={onAdminClick} className="fas fa-wrench cursor-pointer hover:text-gray-300 transition-colors"></i>
                <i className="fas fa-ellipsis-v cursor-pointer"></i>
            </div>
        </header>
    );
};

export default Header;