import React, { useState, useMemo, useEffect } from 'react';
import { TabNode, PostType } from '../../types';

interface CMSManagePostsProps {
    tabsData: TabNode[];
    postsData: PostType[];
    addPost: (tabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle' | 'isEnabled' | 'tabId' | 'createdAt'>) => void;
    togglePostStatus: (postId: number) => void;
}

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
         <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Existing Posts</h3>
            {posts.length === 0 ? (
                <p className="text-gray-500 italic mt-4">No posts have been created yet.</p>
            ) : (
                <ul className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
                    {posts.map(post => (
                        <li key={post.id} className="p-3 border rounded-md flex justify-between items-center bg-gray-50">
                            <div>
                                <p className="text-sm text-gray-700 truncate w-60">"{post.content}"</p>
                                <p className="text-xs text-gray-500 mt-1">{getTabPathString(post.tabId)}</p>
                                <p className="text-xs text-gray-400 mt-1">{post.createdAt}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={post.isEnabled} onChange={() => togglePostStatus(post.id)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Recursive function to generate select options with indentation
// FIX: Changed JSX.Element to React.ReactElement to resolve namespace error.
const renderTabOptions = (nodes: TabNode[], level = 0): React.ReactElement[] => {
    let options: React.ReactElement[] = [];
    nodes.forEach(node => {
        if (node.children.length === 0) { // Only allow posting to "leaf" nodes
             options.push(
                <option key={node.id} value={node.id}>
                    {'--'.repeat(level)} {node.label}
                </option>
            );
        } else { // Render parent as a disabled optgroup label
             options.push(
                <optgroup key={node.id} label={'--'.repeat(level) + ' ' + node.label} />
            );
        }
        if (node.children) {
            options = options.concat(renderTabOptions(node.children, level + 1));
        }
    });
    return options;
};


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
        // Set default selected tab to the first available option if not set
        if (!selectedTab && tabOptions.length > 0) {
            const firstOption = tabOptions.find(opt => opt.props.value);
            if (firstOption) {
                setSelectedTab(firstOption.props.value);
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
                
                <div className="p-6 bg-white rounded-lg shadow-md">
                     <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Create New Post</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="tab-select" className="block text-sm font-medium text-gray-700 mb-1">Select Tab</label>
                            <select id="tab-select" value={selectedTab} onChange={(e) => setSelectedTab(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]">
                                {tabOptions}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Post Content</label>
                            <textarea id="content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} maxLength={1000} placeholder="What's happening?" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]" />
                            <p className="text-right text-sm text-gray-500 mt-1">{content.length} / 1000</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Images ({imageUrls.length}/10)</label>
                            <input type="file" id="image-upload" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            <button type="button" onClick={() => document.getElementById('image-upload')?.click()} className="w-full bg-gray-100 border-2 border-dashed p-3 rounded-md text-sm hover:bg-gray-200">
                                <i className="fas fa-upload mr-2"></i> Upload Images
                            </button>
                             <div className="flex flex-wrap gap-2 mt-2">
                                {imageUrls.map((url, index) => (
                                   <div key={index} className="relative w-20 h-20 rounded-md overflow-hidden border">
                                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                                        <button onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">&times;</button>
                                    </div>
                                ))}
                                {isLoading && <div className="w-20 h-20 flex items-center justify-center border rounded-md"><i className="fas fa-spinner fa-spin text-gray-500"></i></div>}
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Video</label>
                            <input type="file" id="video-upload" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                            <button type="button" onClick={() => document.getElementById('video-upload')?.click()} className="w-full bg-gray-100 border-2 border-dashed p-3 rounded-md text-sm hover:bg-gray-200">
                                <i className="fas fa-video mr-2"></i> {videoUrl ? 'Change Video' : 'Upload Video'}
                            </button>
                            {videoUrl && <p className="text-xs text-green-600 mt-1 truncate">Video selected.</p>}
                        </div>

                        <div className="flex justify-end items-center pt-2 border-t">
                            <button type="submit" className="bg-[#00A884] text-white px-6 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md font-semibold">Publish Post</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CMSManagePosts;