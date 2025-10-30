import React, { useState } from 'react';
import CMSSidebar from './CMSSidebar';
import CMSGeneralSettings from './CMSGeneralSettings';
import CMSManageTabs from './CMSManageTabs';
import CMSManagePosts from './CMSManagePosts';
import { BannerType, TabNode, PostType } from '../../types';

interface CMSPanelProps {
    onExitAdminMode: () => void;
    bannerData: BannerType;
    updateBannerData: (newData: BannerType) => void;
    tabsData: TabNode[];
    postsData: PostType[];
    addPost: (tabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle' | 'isEnabled' | 'tabId' | 'createdAt'>) => void;
    addTab: (parentId: string | null, newTab: Omit<TabNode, 'children'>) => void;
    togglePostStatus: (postId: number) => void;
}

const CMSPanel: React.FC<CMSPanelProps> = (props) => {
    const { 
        onExitAdminMode, 
        bannerData, 
        updateBannerData, 
        tabsData, 
        postsData,
        addPost, 
        addTab,
        togglePostStatus,
    } = props;
    const [activeView, setActiveView] = useState('posts'); // Default to posts view

    const renderActiveView = () => {
        switch (activeView) {
            case 'general':
                return <CMSGeneralSettings bannerData={bannerData} updateBannerData={updateBannerData} />;
            case 'tabs':
                return <CMSManageTabs tabsData={tabsData} addTab={addTab} />;
            case 'posts':
                return <CMSManagePosts tabsData={tabsData} addPost={addPost} postsData={postsData} togglePostStatus={togglePostStatus} />;
            default:
                return <CMSGeneralSettings bannerData={bannerData} updateBannerData={updateBannerData} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <CMSSidebar activeView={activeView} setActiveView={setActiveView} onExitAdminMode={onExitAdminMode} />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderActiveView()}
            </main>
        </div>
    );
};

export default CMSPanel;
