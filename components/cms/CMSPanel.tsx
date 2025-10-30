import React, { useState } from 'react';
import CMSSidebar from './CMSSidebar';
import CMSGeneralSettings from './CMSGeneralSettings';
import CMSManageTabs from './CMSManageTabs';
import CMSManagePosts from './CMSManagePosts';
import { BannerType, TabType, PostType } from '../../types';

interface AllTabs {
    main: TabType[];
    rajya: TabType[];
    raigarh: TabType[];
    reforms: TabType[];
    yojanaye: TabType[];
}

interface CMSPanelProps {
    onExitAdminMode: () => void;
    bannerData: BannerType;
    updateBannerData: (newData: BannerType) => void;
    tabsData: AllTabs;
    addPost: (subTabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle'>) => void;
    addSubTab: (mainTabId: keyof AllTabs, newTab: TabType) => void;
}

const CMSPanel: React.FC<CMSPanelProps> = (props) => {
    const { onExitAdminMode, bannerData, updateBannerData, tabsData, addPost, addSubTab } = props;
    const [activeView, setActiveView] = useState('general');

    const renderActiveView = () => {
        switch (activeView) {
            case 'general':
                return <CMSGeneralSettings bannerData={bannerData} updateBannerData={updateBannerData} />;
            case 'tabs':
                return <CMSManageTabs tabsData={tabsData} addSubTab={addSubTab} />;
            case 'posts':
                return <CMSManagePosts tabsData={tabsData} addPost={addPost} />;
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
