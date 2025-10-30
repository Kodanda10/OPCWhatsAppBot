
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#f0f0f0] dark:bg-gray-800 p-2 flex items-center border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex-grow flex items-center bg-white dark:bg-gray-700 rounded-full px-4 py-2 shadow-sm">
                <i className="far fa-grin text-gray-500 dark:text-gray-400 text-2xl cursor-pointer"></i>
                <input
                    type="text"
                    placeholder="Message"
                    className="flex-grow bg-transparent focus:outline-none mx-3 placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
                />
                <i className="fas fa-paperclip text-gray-500 dark:text-gray-400 text-xl mr-3 cursor-pointer"></i>
                <i className="fas fa-camera text-gray-500 dark:text-gray-400 text-xl cursor-pointer"></i>
            </div>
            <button className="bg-[#00A884] text-white rounded-full w-12 h-12 flex items-center justify-center ml-2 flex-shrink-0 shadow-md hover:bg-[#008a6b] transition-colors">
                <i className="fas fa-microphone text-xl"></i>
            </button>
        </footer>
    );
};

export default Footer;