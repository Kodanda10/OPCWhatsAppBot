import React, { useState } from 'react';
import CMSSidebar from './CMSSidebar';
import CMSGeneralSettings from './CMSGeneralSettings';
import { BannerType } from '../../types';

interface CMSPanelProps {
    onExitAdminMode: () => void;
    bannerData: BannerType;
    updateBannerData: (newData: BannerType) => void;
}

const CMSPanel: React.FC<CMSPanelProps> = ({ onExitAdminMode, bannerData, updateBannerData }) => {
    const [activeView, setActiveView] = useState('general');

    const renderActiveView = () => {
        switch (activeView) {
            case 'general':
                return <CMSGeneralSettings bannerData={bannerData} updateBannerData={updateBannerData} />;
            case 'tabs':
                return <div className="p-8 bg-white rounded-lg shadow-md"> <h2 className="text-2xl font-bold mb-4">Manage Tabs</h2> <p>This feature is coming soon.</p> </div>;
            case 'posts':
                return <div className="p-8 bg-white rounded-lg shadow-md"> <h2 className="text-2xl font-bold mb-4">Manage Posts</h2> <p>This feature is coming soon.</p> </div>;
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
