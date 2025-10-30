import React, { useState } from 'react';
import { TabNode } from '../../types';

interface CMSManageTabsProps {
    tabsData: TabNode[];
    addTab: (parentId: string | null, newTab: Omit<TabNode, 'children'>) => void;
}

interface TabListItemProps {
    node: TabNode;
    level: number;
}

// Recursive component to display the nested list of tabs
const TabListItem: React.FC<TabListItemProps> = ({ node, level }) => (
    <div>
        <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600">
            <span style={{ marginLeft: `${level * 20}px` }} className="text-gray-800 dark:text-gray-200">{node.label}</span>
        </div>
        {node.children && node.children.length > 0 && (
            <div className="pl-4 mt-1 space-y-1 border-l-2 dark:border-gray-600 ml-2">
                {node.children.map(child => <TabListItem key={child.id} node={child} level={level + 1} />)}
            </div>
        )}
    </div>
);

// Component to render flattened list for the select dropdown
const renderTabOptions = (nodes: TabNode[], level = 0): React.ReactElement[] => {
    let options: React.ReactElement[] = [];
    nodes.forEach(node => {
        options.push(
            <option key={node.id} value={node.id} className="bg-white dark:bg-gray-800 text-black dark:text-white">
                {'--'.repeat(level)} {node.label}
            </option>
        );
        if (node.children && node.children.length > 0) {
            options = options.concat(renderTabOptions(node.children, level + 1));
        }
    });
    return options;
};


const CMSManageTabs: React.FC<CMSManageTabsProps> = ({ tabsData, addTab }) => {
    const [newTabLabel, setNewTabLabel] = useState('');
    const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTabLabel.trim()) return;

        const newTabId = newTabLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const newTab = {
            id: newTabId,
            label: newTabLabel.trim(),
        };

        addTab(selectedParentId, newTab);
        setNewTabLabel('');
        setSelectedParentId(null);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-b dark:border-gray-700 pb-4">Manage Tabs</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Add New Tab</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="parent-tab-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Parent Tab (Optional)
                            </label>
                            <select
                                id="parent-tab-select"
                                value={selectedParentId ?? ''}
                                onChange={(e) => setSelectedParentId(e.target.value || null)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 dark:text-white"
                            >
                                <option value="" className="bg-white dark:bg-gray-800 text-black dark:text-white">-- No Parent (Top Level) --</option>
                                {renderTabOptions(tabsData)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="new-tab-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Tab Label
                            </label>
                            <input
                                type="text"
                                id="new-tab-label"
                                value={newTabLabel}
                                onChange={(e) => setNewTabLabel(e.target.value)}
                                placeholder="e.g., शिक्षा"
                                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[#075E54] focus:border-[#075E54] text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex justify-end items-center pt-2">
                             {isSaved && <span className="text-green-600 dark:text-green-400 mr-4">Tab Added!</span>}
                            <button type="submit" className="bg-[#00A884] text-white px-6 py-2 rounded-md hover:bg-[#008a6b] transition-colors shadow-md">
                                Add Tab
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-2">
                     <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Tab Structure</h3>
                      <div className="space-y-2 p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/50 max-h-96 overflow-y-auto">
                        {tabsData.map(node => <TabListItem key={node.id} node={node} level={0} />)}
                      </div>
                </div>
            </div>
        </div>
    );
};

export default CMSManageTabs;