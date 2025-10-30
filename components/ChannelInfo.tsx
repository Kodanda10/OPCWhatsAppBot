import React from 'react';

interface ChannelInfoProps {
    profileUrl: string;
    title: string;
    followers: string;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({ profileUrl, title, followers }) => {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
                <img 
                    src={profileUrl} 
                    alt="Channel DP" 
                    className="rounded-full w-20 h-20 mr-4 border-4 border-white dark:border-gray-600 shadow-lg object-cover" 
                />
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{followers}</p>
                </div>
            </div>
        </div>
    );
};

export default ChannelInfo;