import React, { useState } from 'react';
import { TabType } from '../../types';

interface AllTabs {
    main: TabType[];
    rajya: TabType[];
    raigarh: TabType[];
    reforms: TabType[];
}

interface CMSManageTabsProps {
    tabsData: AllTabs;
    addSubTab: (mainTabId: keyof AllTabs, newTab: TabType) => void;
}

const CMSManageTabs: React.FC<CMSManageTabsProps> = ({ tabsData, addSubTab }) => {
    const [newTabLabel, setNewTabLabel] = useState('');
    const [selectedMainTab, setSelectedMainTab] = useState<keyof AllTabs>('rajya');
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTabLabel.trim()) return;

        const newTabId = newTabLabel.trim().toLowerCase().replace(/\s+/g, '-');
        const newTab: TabType = {
            id: newTabId,
            label: newTabLabel.trim(),
        };

        addSubTab(selectedMainTab, newTab);
        setNewTabLabel('');
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Tabs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form to add a new tab */}
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Sub-Tab</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="main-tab-select" className="block text-sm font-medium text-gray-700 mb-1">
                                Parent Main Tab
                            </label>
                            <select
                                id="main-tab-select"
                                value={selectedMainTab}
                                onChange={(e) => setSelectedMainTab(e.target.value as keyof AllTabs)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                            >
                                {tabsData.main.filter(t => t.id !== 'vision').map(tab => (
                                    <option key={tab.id} value={tab.id}>{tab.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="new-tab-label" className="block text-sm font-medium text-gray-700 mb-1">
                                New Sub-Tab Label
                            </label>
                            <input
                                type="text"
                                id="new-tab-label"
                                value={newTabLabel}
                                onChange={(e) => setNewTabLabel(e.target.value)}
                                placeholder="e.g., शिक्षा"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54]"
                            />
                        </div>
                        <div className="flex justify-end items-center pt-2">
                             {isSaved && <span className="text-green-600 mr-4">Tab Added!</span>}
                            <button type="submit" className="bg-[#00A884] text-white px-6 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md">
                                Add Tab
                            </button>
                        </div>
                    </form>
                </div>

                {/* Display existing tabs */}
                <div className="space-y-4">
                     <h3 className="text-xl font-semibold text-gray-700 mb-2">Current Tab Structure</h3>
                    {tabsData.main.map(mainTab => (
                        <div key={mainTab.id}>
                            <h4 className="font-bold text-lg text-[#075E54]">{mainTab.label}</h4>
                            <ul className="list-disc list-inside pl-4 mt-1 text-gray-600 space-y-1">
                                {(tabsData[mainTab.id as keyof AllTabs] || []).map(subTab => (
                                    <li key={subTab.id}>{subTab.label}</li>
                                ))}
                                 {(tabsData[mainTab.id as keyof AllTabs] || []).length === 0 && <li className="text-gray-400 italic">No sub-tabs</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CMSManageTabs;
