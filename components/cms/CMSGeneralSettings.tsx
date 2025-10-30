import React, { useState, useEffect } from 'react';
import { BannerType } from '../../types';

// Utility to read file as Base64
const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const Toast: React.FC<{ message: string; show: boolean; type: 'success' | 'error' }> = ({ message, show, type }) => {
    if (!show) return null;
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            {message}
        </div>
    );
};

const FileUploader: React.FC<{
    label: string;
    currentUrl: string;
    onFileSelect: (base64: string) => void;
    aspect: 'banner' | 'profile';
}> = ({ label, currentUrl, onFileSelect, aspect }) => {
    const [isLoading, setIsLoading] = useState(false);
    const inputId = `file-upload-${aspect}`;
    const isProfile = aspect === 'profile';

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const base64 = await readFileAsBase64(file);
                onFileSelect(base64);
            } catch (error) {
                console.error("Error reading file:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
            <input id={inputId} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <div 
                onClick={() => document.getElementById(inputId)?.click()}
                className={`cursor-pointer group relative border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#075E54] dark:hover:border-green-400 transition-colors
                    ${isProfile ? 'rounded-full w-32 h-32 mx-auto' : 'rounded-lg w-full h-32'}`}
            >
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin text-gray-500 text-2xl"></i>
                    </div>
                ) : currentUrl ? (
                    <>
                        <img src={currentUrl} alt={`${aspect} preview`} className={`object-cover w-full h-full ${isProfile ? 'rounded-full' : 'rounded-lg'}`} />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <i className="fas fa-upload mr-2"></i> Change
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                        <span className="text-sm text-center">Click to upload</span>
                    </div>
                )}
            </div>
        </div>
    );
};


interface CMSGeneralSettingsProps {
    bannerData: BannerType;
    updateBannerData: (newData: BannerType) => void;
}

const CMSGeneralSettings: React.FC<CMSGeneralSettingsProps> = ({ bannerData, updateBannerData }) => {
    const [formData, setFormData] = useState<BannerType>(bannerData);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        setFormData(bannerData);
    }, [bannerData]);
    
    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBannerData(formData);
        showNotification('Settings saved successfully!');
    };

    return (
        <>
            <Toast message={toastMessage} show={showToast} type="success" />
            <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b dark:border-gray-700 pb-4">General Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-10">
                    <fieldset>
                        <legend className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Channel Identity</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Channel Title</label>
                                <input
                                    type="text" id="title" name="title" value={formData.title}
                                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="followers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Follower Count</label>
                                <input
                                    type="text" id="followers" name="followers" value={formData.followers}
                                     onChange={(e) => setFormData(p => ({ ...p, followers: e.target.value }))}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Channel Imagery</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                           <FileUploader 
                                label="Banner Image"
                                currentUrl={formData.bannerUrl}
                                onFileSelect={(base64) => setFormData(p => ({ ...p, bannerUrl: base64 }))}
                                aspect="banner"
                           />
                           <FileUploader 
                                label="Profile Image"
                                currentUrl={formData.profileUrl}
                                onFileSelect={(base64) => setFormData(p => ({ ...p, profileUrl: base64 }))}
                                aspect="profile"
                           />
                        </div>
                    </fieldset>

                    <div className="flex justify-end items-center pt-4 border-t dark:border-gray-700 mt-8">
                        <button type="submit" className="bg-[#00A884] text-white px-6 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A884]">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CMSGeneralSettings;