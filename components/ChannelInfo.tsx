import React from 'react';

interface ChannelInfoProps {
    profileUrl: string;
    title: string;
    followers: string;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({ profileUrl, title, followers }) => {
    return (
        <div className="bg-gray-100 p-4 flex-shrink-0 border-b border-gray-200">
            <div className="flex items-center">
                <img 
                    src={profileUrl} 
                    alt="Channel DP" 
                    className="rounded-full w-20 h-20 mr-4 border-4 border-white shadow-lg object-cover" 
                />
                <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <p className="text-sm text-gray-500">{followers}</p>
                </div>
            </div>
        </div>
    );
};

export default ChannelInfo;