import React, { useState, useMemo } from 'react';
import { TabType, PostType } from '../../types';

interface AllTabs {
    main: TabType[];
    rajya: TabType[];
    raigarh: TabType[];
    reforms: TabType[];
}

interface CMSManagePostsProps {
    tabsData: AllTabs;
    addPost: (subTabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle'>) => void;
}

const ImagePreview: React.FC<{ url: string, onRemove: () => void }> = ({ url, onRemove }) => (
    <div className="relative w-24 h-24 rounded-md overflow-hidden border">
        <img src={url} alt="preview" className="w-full h-full object-cover" />
        <button
            onClick={onRemove}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
            aria-label="Remove image"
        >
            &times;
        </button>
    </div>
);


const CMSManagePosts: React.FC<CMSManagePostsProps> = ({ tabsData, addPost }) => {
    const [content, setContent] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedSubTab, setSelectedSubTab] = useState('');
    const [isPublished, setIsPublished] = useState(false);

    const subTabsList = useMemo(() => {
        return Object.keys(tabsData)
            .filter(key => key !== 'main' && key !== 'yojanaye')
            .flatMap(key => tabsData[key as keyof AllTabs].map(subTab => ({ ...subTab, mainLabel: tabsData.main.find(m => m.id === key)?.label })))
    }, [tabsData]);

    // Set a default sub-tab
    useState(() => {
        if (subTabsList.length > 0 && !selectedSubTab) {
            setSelectedSubTab(subTabsList[0].id);
        }
    });

    const handleAddImage = () => {
        if (currentImageUrl && imageUrls.length < 10) {
            setImageUrls([...imageUrls, currentImageUrl]);
            setCurrentImageUrl('');
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setImageUrls(imageUrls.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !selectedSubTab) return;

        addPost(selectedSubTab, {
            content,
            imageUrls,
            videoUrl
        });

        // Reset form
        setContent('');
        setImageUrls([]);
        setCurrentImageUrl('');
        setVideoUrl('');
        
        setIsPublished(true);
        setTimeout(() => setIsPublished(false), 3000);
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tab Selection */}
                <div>
                    <label htmlFor="sub-tab-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Sub-Tab to Post In
                    </label>
                    <select
                        id="sub-tab-select"
                        value={selectedSubTab}
                        onChange={(e) => setSelectedSubTab(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                    >
                         {subTabsList.map(tab => (
                            <option key={tab.id} value={tab.id}>{tab.mainLabel} &gt; {tab.label}</option>
                        ))}
                    </select>
                </div>

                {/* Content */}
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Post Content
                    </label>
                    <textarea
                        id="content"
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={1000}
                        placeholder="What's happening?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                    />
                    <p className="text-right text-sm text-gray-500 mt-1">{content.length} / 1000</p>
                </div>

                {/* Images */}
                <div className="p-4 border rounded-md">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Images (up to 10)</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={currentImageUrl}
                            onChange={(e) => setCurrentImageUrl(e.target.value)}
                            placeholder="Enter image URL"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                        />
                        <button type="button" onClick={handleAddImage} disabled={imageUrls.length >= 10} className="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {imageUrls.map((url, index) => (
                           <ImagePreview key={index} url={url} onRemove={() => handleRemoveImage(index)} />
                        ))}
                    </div>
                </div>

                {/* Video */}
                <div>
                     <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
                     <input
                        type="text"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end items-center pt-4 border-t">
                    {isPublished && <span className="text-green-600 mr-4">Published successfully!</span>}
                    <button type="submit" className="bg-[#00A884] text-white px-8 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md text-lg font-semibold">
                        Publish Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CMSManagePosts;
