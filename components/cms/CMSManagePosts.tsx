import React, { useState, useMemo, useEffect } from 'react';
import { TabNode, PostType } from '../../types';
import { uploadFile } from '../../firebase';

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


const Toast: React.FC<{ message: string; show: boolean; type: 'success' | 'error' }> = ({ message, show, type }) => {
    if (!show) return null;
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className={`fixed top-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform ${show ? 'translate-x-0' : 'translate-x-full'}`}>
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
        <>
            {posts.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 italic mt-4">No posts have been created yet.</p>
            ) : (
                <ul className="space-y-4">
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
        </>
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
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const allPosts = useMemo(() => {
        return [...postsData].sort((a, b) => {
            if (sortOrder === 'oldest') {
                return a.id - b.id;
            }
            return b.id - a.id; // Default to newest
        });
    }, [postsData, sortOrder]);

    const tabOptions = useMemo(() => renderTabOptions(tabsData), [tabsData]);
    
    useEffect(() => {
        if (!selectedTab && tabOptions.length > 0) {
            const firstOption = tabOptions.find(opt => (opt.props as any).value);
            if (firstOption) {
                setSelectedTab((firstOption.props as any).value);
            }
        }
    }, [tabOptions, selectedTab]);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(p => ({ ...p, show: false })), 4000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setIsLoading(true);
        const uploadPromises: Promise<string>[] = [];
        for (let i = 0; i < files.length && (imageUrls.length + uploadPromises.length) < 10; i++) {
            const file = files[i];
            const promise = readFileAsBase64(file).then(base64 => {
                const filePath = `posts/images/${Date.now()}-${file.name}`;
                return uploadFile(base64, filePath);
            });
            uploadPromises.push(promise);
        }
        try {
            const newUrls = await Promise.all(uploadPromises);
            setImageUrls(prev => [...prev, ...newUrls]);
        } catch (error) {
            console.error("Failed to upload images:", error);
            showNotification("Image upload failed. Please check Storage security rules.", 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
     const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsLoading(true);
            try {
                const base64 = await readFileAsBase64(file);
                const filePath = `posts/videos/${Date.now()}-${file.name}`;
                const downloadURL = await uploadFile(base64, filePath);
                setVideoUrl(downloadURL);
            } catch (error) {
                console.error("Failed to upload video:", error);
                showNotification("Video upload failed. Please check Storage security rules.", 'error');
            } finally {
                setIsLoading(false);
            }
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
        showNotification("Post published successfully!");
    };

    return (
        <>
            <Toast message={toast.message} show={toast.show} type={toast.type} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-2 flex-shrink-0">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Existing Posts</h3>
                        <div>
                            <label htmlFor="sort-posts" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Sort by:</label>
                            <select
                                id="sort-posts"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-sm text-gray-900 dark:text-white"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2">
                        <PostList posts={allPosts} tabsData={tabsData} togglePostStatus={togglePostStatus} />
                    </div>
                </div>
                
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