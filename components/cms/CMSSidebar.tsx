import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';


interface CMSSidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    onExitAdminMode: () => void;
}

const ThemeToggleButton: React.FC = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('ThemeToggleButton must be used within a ThemeProvider');
    }
    const { theme, toggleTheme } = context;

    return (
        <button 
            onClick={toggleTheme} 
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
            title="Toggle Theme" 
            aria-label="Toggle Theme"
        >
             {theme === 'dark' 
                ? <><i className="fas fa-sun w-5 text-center"></i><span>Light Mode</span></>
                : <><i className="fas fa-moon w-5 text-center"></i><span>Dark Mode</span></>
             }
        </button>
    );
};


const CMSSidebar: React.FC<CMSSidebarProps> = ({ activeView, setActiveView, onExitAdminMode }) => {
    const navItems = [
        { id: 'general', label: 'General Settings', icon: 'fas fa-cog' },
        { id: 'tabs', label: 'Manage Tabs', icon: 'fas fa-folder' },
        { id: 'posts', label: 'Manage Posts', icon: 'fas fa-file-alt' },
    ];

    return (
        <aside className="w-64 bg-[#075E54] dark:bg-gray-800 text-white flex flex-col">
            <div className="p-4 border-b border-white/20 dark:border-gray-700">
                <h1 className="text-2xl font-bold">CMS Panel</h1>
                <p className="text-sm opacity-80">WhatsApp Channel</p>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`w-full text-left flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                            activeView === item.id ? 'bg-white/20' : 'hover:bg-white/10'
                        }`}
                    >
                        <i className={`${item.icon} w-5 text-center`}></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-white/20 dark:border-gray-700 space-y-2">
                <ThemeToggleButton />
                <button
                    onClick={onExitAdminMode}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors hover:bg-white/10"
                >
                    <i className="fas fa-arrow-left w-5 text-center"></i>
                    <span>Exit Admin Mode</span>
                </button>
            </div>
        </aside>
    );
};

export default CMSSidebar;