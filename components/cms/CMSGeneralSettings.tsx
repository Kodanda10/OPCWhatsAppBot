import React, { useState, useEffect } from 'react';
import { BannerType, PostType, TabNode } from '../../types';
import { uploadFile } from '../../firebase'; // Import the new Firebase upload function

// Utility to read file as Base64 for preview and upload
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
    onFileSelect: (url: string) => void;
    onError: (message: string) => void;
    aspect: 'banner' | 'profile';
}> = ({ label, currentUrl, onFileSelect, onError, aspect }) => {
    const [isLoading, setIsLoading] = useState(false);
    const inputId = `file-upload-${aspect}`;
    const isProfile = aspect === 'profile';

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const base64 = await readFileAsBase64(file);
                // The filename will be unique due to the timestamp
                const filePath = `images/${aspect}-${Date.now()}-${file.name}`;
                const downloadURL = await uploadFile(base64, filePath);
                onFileSelect(downloadURL);
            } catch (error) {
                console.error("Error uploading file:", error);
                onError("File upload failed. Please check your Firebase Storage security rules and ensure the service is enabled.");
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
    postsData: PostType[];
    tabsData: TabNode[];
    updatePostsData: (newData: PostType[]) => void;
    updateTabsData: (newData: TabNode[]) => void;
}

const CMSGeneralSettings: React.FC<CMSGeneralSettingsProps> = ({ 
    bannerData, 
    updateBannerData,
    postsData,
    tabsData,
    updatePostsData,
    updateTabsData 
}) => {
    const [formData, setFormData] = useState<BannerType>(bannerData);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });

    useEffect(() => {
        setFormData(bannerData);
    }, [bannerData]);
    
    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(p => ({ ...p, show: false })), 4000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateBannerData(formData);
        showNotification('Settings saved successfully!');
    };
    
    const handleExport = () => {
        try {
            const exportedData = {
                bannerData: bannerData,
                postsData: postsData,
                tabsData: tabsData,
            };
            const jsonString = JSON.stringify(exportedData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `whatsapp-channel-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            showNotification('Data exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            showNotification('Could not export data.', 'error');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File could not be read as text.");
                }
                const importedData = JSON.parse(text);

                if (importedData.bannerData && Array.isArray(importedData.postsData) && Array.isArray(importedData.tabsData)) {
                    // Update state and persist to Firebase
                    updateBannerData(importedData.bannerData);
                    updatePostsData(importedData.postsData);
                    updateTabsData(importedData.tabsData);
                    showNotification('Data imported successfully!');
                } else {
                    showNotification('Invalid backup file format.', 'error');
                }
            } catch (error) {
                console.error("Error importing data:", error);
                showNotification('Failed to parse the backup file.', 'error');
            }
        };
        reader.onerror = () => {
             showNotification('Failed to read the file.', 'error');
        };
        reader.readAsText(file);
        
        e.target.value = '';
    };

    return (
        <>
            <Toast message={toast.message} show={toast.show} type={toast.type} />
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
                                onFileSelect={(url) => setFormData(p => ({ ...p, bannerUrl: url }))}
                                onError={(msg) => showNotification(msg, 'error')}
                                aspect="banner"
                           />
                           <FileUploader 
                                label="Profile Image"
                                currentUrl={formData.profileUrl}
                                onFileSelect={(url) => setFormData(p => ({ ...p, profileUrl: url }))}
                                onError={(msg) => showNotification(msg, 'error')}
                                aspect="profile"
                           />
                        </div>
                    </fieldset>

                     <fieldset>
                        <legend className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Data Management</legend>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-dashed dark:border-gray-700 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                                <button type="button" onClick={handleExport} className="w-full sm:w-auto flex-shrink-0 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center space-x-2">
                                    <i className="fas fa-download"></i>
                                    <span>Export Data</span>
                                </button>
                                <label className="w-full sm:w-auto flex-shrink-0 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer flex items-center justify-center space-x-2">
                                    <i className="fas fa-upload"></i>
                                    <span>Import Data</span>
                                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                                </label>
                            </div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                Save all your content to a backup file. You can import this file later to restore everything. This is highly recommended to prevent data loss.
                            </p>
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