import React, { useState, useMemo, useEffect } from 'react';
import { TabNode, PostType } from '../../types';

// Reusable Uploader Component for this file
const FileUploader: React.FC<{
    label: string;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputId: string;
    isMultiple?: boolean;
    accept: string;
    subText: string;
    iconClass: string;
}> = ({ label, onFileSelect, inputId, isMultiple = false, accept, subText, iconClass }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input type="file" id={inputId} multiple={isMultiple} accept={accept} onChange={onFileSelect} className="hidden" />
        <div 
            onClick={() => document.getElementById(inputId)?.click()}
            className="cursor-pointer group bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-[#075E54] dark:hover:border-green-400 transition-colors"
        >
            <div className="text-gray-500 dark:text-gray-400">
                <i className={`${iconClass} text-3xl mb-2`}></i>
                <p className="font-semibold">Click to upload</p>
                <p className="text-xs">{subText}</p>
            </div>
        </div>
    </div>
);


const Toast: React.FC<{ message: string; show: boolean; }> = ({ message, show }) => {
    if (!show) return null;
    return (
        <div className={`fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            {message}
        </div>
    );
};

const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};


// Helper to find a tab path by its ID
const findTabPath = (nodes: TabNode[], tabId: string, path: string[] = []): string[] => {
    for (const node of nodes) {
        const newPath = [...path, node.label];
        if (node.id === tabId) {
            return newPath;
        }
        const foundPath = findTabPath(node.children, tabId, newPath);
        if (foundPath.length > newPath.length) {
            return foundPath;
        }
    }
    return path;
};


const PostList: React.FC<{ 
    posts: PostType[]; 
    tabsData: TabNode[];
    togglePostStatus: (postId: number) => void;
}> = ({ posts, tabsData, togglePostStatus }) => {
    
    const getTabPathString = (tabId: string): string => {
        const path = findTabPath(tabsData, tabId);
        return path.length > 0 ? path.join(' > ') : 'Unknown Tab';
    };

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">Existing Posts</h3>
            {posts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic mt-4">No posts have been created yet.</p>
            ) : (
                <ul className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    {posts.map(post => (
                        <li key={post.id} className="p-3 border dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 truncate w-60">"{post.content}"</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getTabPathString(post.tabId)}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{post.createdAt}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={post.isEnabled} onChange={() => togglePostStatus(post.id)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Recursive function to generate select options with indentation
const renderTabOptions = (nodes: TabNode[], level = 0): React.ReactElement[] => {
    let options: React.ReactElement[] = [];
    nodes.forEach(node => {
        const optionClasses = "bg-white dark:bg-gray-800 text-black dark:text-white";
        if (node.children.length === 0) { // Only allow posting to "leaf" nodes
             options.push(
                <option key={node.id} value={node.id} className={optionClasses}>
                    {'--'.repeat(level)} {node.label}
                </option>
            );
        } else { // Render parent as a disabled optgroup label
             options.push(
                <optgroup key={node.id} label={'--'.repeat(level) + ' ' + node.label} className={optionClasses} />
            );
        }
        if (node.children) {
            options = options.concat(renderTabOptions(node.children, level + 1));
        }
    });
    return options;
};

interface CMSManagePostsProps {
    tabsData: TabNode[];
    postsData: PostType[];
    addPost: (tabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle' | 'isEnabled' | 'tabId' | 'createdAt'>) => void;
    togglePostStatus: (postId: number) => void;
}

const CMSManagePosts: React.FC<CMSManagePostsProps> = ({ tabsData, postsData, addPost, togglePostStatus }) => {
    const [content, setContent] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedTab, setSelectedTab] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const allPosts = useMemo(() => [...postsData].sort((a, b) => b.id - a.id), [postsData]);
    const tabOptions = useMemo(() => renderTabOptions(tabsData), [tabsData]);
    
    useEffect(() => {
        if (!selectedTab && tabOptions.length > 0) {
            // FIX: Cast opt.props to any to resolve incorrect type inference.
            const firstOption = tabOptions.find(opt => (opt.props as any).value);
            if (firstOption) {
                // FIX: Cast firstOption.props to any to resolve incorrect type inference.
                setSelectedTab((firstOption.props as any).value);
            }
        }
    }, [tabOptions, selectedTab]);

    const showNotification = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setIsLoading(true);
        const newImages: string[] = [];
        for (let i = 0; i < files.length && (imageUrls.length + newImages.length) < 10; i++) {
            const base64 = await readFileAsBase64(files[i]);
            newImages.push(base64);
        }
        setImageUrls(prev => [...prev, ...newImages]);
        setIsLoading(false);
    };
    
     const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            const base64 = await readFileAsBase64(file);
            setVideoUrl(base64);
            setIsLoading(false);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !selectedTab) return;
        addPost(selectedTab, { content, imageUrls, videoUrl });
        setContent('');
        setImageUrls([]);
        setVideoUrl('');
        showNotification();
    };

    return (
        <>
            <Toast message="Post published successfully!" show={showToast} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <PostList posts={allPosts} tabsData={tabsData} togglePostStatus={togglePostStatus} />
                
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-700 pb-2">Create New Post</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="tab-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Tab</label>
                            <select id="tab-select" value={selectedTab} onChange={(e) => setSelectedTab(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 dark:text-white">
                                {tabOptions}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Post Content</label>
                            <textarea id="content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} maxLength={1000} placeholder="What's happening?" className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 dark:text-white" />
                            <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">{content.length} / 1000</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FileUploader 
                                label={`Images (${imageUrls.length}/10)`}
                                onFileSelect={handleImageUpload}
                                inputId="image-upload"
                                isMultiple={true}
                                accept="image/*"
                                subText="Up to 10 images"
                                iconClass="fas fa-images"
                            />
                            <FileUploader 
                                label="Video"
                                onFileSelect={handleVideoUpload}
                                inputId="video-upload"
                                accept="video/*"
                                subText={videoUrl ? "Video Selected" : "Upload a video"}
                                iconClass="fas fa-video"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {imageUrls.map((url, index) => (
                               <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border dark:border-gray-600">
                                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none">&times;</button>
                                </div>
                            ))}
                            {isLoading && <div className="w-20 h-20 flex items-center justify-center border dark:border-gray-600 rounded-md"><i className="fas fa-spinner fa-spin text-gray-500"></i></div>}
                        </div>

                        <div className="flex justify-end items-center pt-2 border-t dark:border-gray-700">
                            <button type="submit" className="bg-[#00A884] text-white px-6 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md font-semibold">Publish Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CMSManagePosts;