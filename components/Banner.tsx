import React from 'react';

interface BannerProps {
    bannerUrl: string;
}

const Banner: React.FC<BannerProps> = ({ bannerUrl }) => {
    return (
        <div className="bg-gray-200 flex-shrink-0">
            <img src={bannerUrl} alt="Channel Banner" className="w-full h-48 object-cover" />
        </div>
    );
};

export default Banner;