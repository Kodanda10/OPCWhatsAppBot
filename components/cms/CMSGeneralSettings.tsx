import React, { useState, useEffect } from 'react';
import { BannerType } from '../../types';

interface CMSGeneralSettingsProps {
    bannerData: BannerType;
    updateBannerData: (newData: BannerType) => void;
}

const ImagePreview: React.FC<{ url: string; type: 'banner' | 'profile' }> = ({ url, type }) => {
    const isBanner = type === 'banner';
    const baseClasses = "bg-gray-100 border border-gray-200 flex items-center justify-center";
    const bannerClasses = `mt-4 rounded-lg w-full h-32 ${baseClasses}`;
    const profileClasses = `mt-4 rounded-full w-32 h-32 mx-auto ${baseClasses}`;

    return (
        <div className={isBanner ? bannerClasses : profileClasses}>
            {url ? (
                <img 
                    src={url} 
                    alt={`${type} preview`} 
                    className={`object-cover w-full h-full ${isBanner ? 'rounded-lg' : 'rounded-full'}`} 
                />
            ) : (
                <span className="text-sm text-gray-500">No Image</span>
            )}
        </div>
    );
};


const CMSGeneralSettings: React.FC<CMSGeneralSettingsProps> = ({ bannerData, updateBannerData }) => {
    const [formData, setFormData] = useState<BannerType>(bannerData);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setFormData(bannerData);
    }, [bannerData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBannerData(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">General Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
                <fieldset>
                    <legend className="text-xl font-semibold text-gray-700 mb-4">Channel Identity</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Channel Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                            />
                        </div>
                         <div>
                            <label htmlFor="followers" className="block text-sm font-medium text-gray-700 mb-1">Follower Count</label>
                            <input
                                type="text"
                                id="followers"
                                name="followers"
                                value={formData.followers}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                     <legend className="text-xl font-semibold text-gray-700 mb-4">Channel Imagery</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div>
                            <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
                            <input
                                type="text"
                                id="bannerUrl"
                                name="bannerUrl"
                                value={formData.bannerUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/banner.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                            />
                            <ImagePreview url={formData.bannerUrl} type="banner" />
                        </div>
                        <div>
                            <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                            <input
                                type="text"
                                id="profileUrl"
                                name="profileUrl"
                                value={formData.profileUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/profile.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                            />
                            <ImagePreview url={formData.profileUrl} type="profile" />
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end items-center pt-4 border-t mt-8">
                     {isSaved && <span className="text-green-600 mr-4 transition-opacity duration-300">Saved successfully!</span>}
                    <button type="submit" className="bg-[#00A884] text-white px-6 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A884]">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CMSGeneralSettings;