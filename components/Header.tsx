
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md z-10 flex-shrink-0">
            <div className="flex items-center">
                <i className="fas fa-arrow-left text-xl mr-4 cursor-pointer"></i>
            </div>
            <div className="flex items-center space-x-5 text-xl">
                <i className="fas fa-search cursor-pointer"></i>
                <i className="fas fa-bell cursor-pointer"></i>
                <i className="fas fa-ellipsis-v cursor-pointer"></i>
            </div>
        </header>
    );
};

export default Header;
