import React, { useState, useMemo } from 'react';
import { PostType, TabNode, BannerType } from './types';
import Header from './components/Header';
import Banner from './components/Banner';
import ChannelInfo from './components/ChannelInfo';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import CMSPanel from './components/cms/CMSPanel';

// Stable Placeholder Images
const profileImageUrl = 'https://placehold.co/100x100/EFEFEF/333333?text=DP';
const bannerImageUrl = 'https://placehold.co/600x200/CCCCCC/FFFFFF?text=Channel+Banner';

const initialBannerData: BannerType = {
    bannerUrl: bannerImageUrl,
    profileUrl: profileImageUrl,
    title: "श्री ओपी चौधरी के काम",
    followers: "1.2M followers"
};

const initialTabsData: TabNode[] = [
    { id: 'rajya', label: 'राज्य', children: [
        { id: 'vitt', label: 'वित्त', children: [] },
        { id: 'yojanaye', label: 'योजनाएं', children: [
            { id: 'pmay', label: 'प्रधानमंत्री आवास योजना-ग्रामीण', children: [] },
            { id: 'mahatari', label: 'महतारी वंदन योजना', children: [] },
        ]},
        { id: 'vyapar', label: 'व्यापार कर / वाणिज्य कर', children: [] },
        { id: 'awas', label: 'आवास और पर्यावरण योजना', children: [] },
        { id: 'arth', label: 'अर्थशास्त्र एवं सांख्यिकी', children: [] },
    ]},
    { id: 'raigarh', label: 'रायगढ़', children: [
        { id: 'vikas', label: 'विकास कार्य', children: [] },
        { id: 'bhent', label: 'भेंट/समारोह', children: [] },
    ]},
    { id: 'reforms', label: 'रिफॉर्म्स', children: [
        { id: 'scr', label: 'SCR (स्टेट कैपिटल रीजन)', children: [] },
        { id: 'registry', label: 'रजिस्ट्री - स्मार्ट पंजीयन', children: [] },
    ]},
    { id: 'vision', label: 'विज़न', children: [] },
];


const TabBar: React.FC<{
    tabs: TabNode[];
    activeTabId: string | undefined;
    onTabClick: (id: string) => void;
    level: number;
}> = ({ tabs, activeTabId, onTabClick, level }) => {
    if (tabs.length === 0) return null;

    if (level === 0) { // Main tabs
        return (
             <nav className="bg-[#075E54] text-gray-300 font-medium flex-shrink-0">
                <div className="flex justify-around">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabClick(tab.id)}
                            className={`flex-1 py-3 text-sm uppercase tracking-wide transition-colors duration-200 ${
                                activeTabId === tab.id ? 'border-b-4 border-white text-white' : 'hover:bg-white/10'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>
        )
    }
    
    // Sub-tabs
    return (
        <div className="flex overflow-x-auto space-x-2 p-2 mb-4 bg-gray-100 rounded-lg">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`whitespace-nowrap border px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
                        activeTabId === tab.id
                            ? 'bg-[#DCF8C6] text-gray-800 border-[#DCF8C6]'
                            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};


const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-3 rounded-lg shadow-sm">
        <h3 className="font-bold text-green-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{children}</p>
    </div>
);


const App: React.FC = () => {
    // CMS State
    const [isAdminMode, setIsAdminMode] = useState(false);

    // Content State
    const [bannerData, setBannerData] = useState<BannerType>(initialBannerData);
    const [postsData, setPostsData] = useState<PostType[]>([]); // Central array for all posts
    const [tabsData, setTabsData] = useState<TabNode[]>(initialTabsData);
    
    // UI State
    const [activeTabPath, setActiveTabPath] = useState<string[]>(['rajya']);

    const addPost = (tabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle' | 'isEnabled' | 'tabId' | 'createdAt'>) => {
        const newPost: PostType = {
            id: Date.now(),
            author: 'श्री ओपी चौधरी',
            handle: '@OPChoudhary',
            timestamp: 'Just now',
            createdAt: new Date().toLocaleString(),
            profileUrl: bannerData.profileUrl,
            stats: { comments: 0, retweets: 0, likes: 0, views: '0' },
            isEnabled: true,
            tabId: tabId,
            ...newPostContent,
        };
        setPostsData(prev => [newPost, ...prev]);
    };
    
    const togglePostStatus = (postId: number) => {
        setPostsData(prev => prev.map(post => 
            post.id === postId ? { ...post, isEnabled: !post.isEnabled } : post
        ));
    };
    
    const addTab = (parentId: string | null, newTab: Omit<TabNode, 'children'>) => {
        const newTabNode: TabNode = { ...newTab, children: [] };
        
        if (parentId === null) {
            setTabsData(prev => [...prev, newTabNode]);
            return;
        }

        const addRecursively = (nodes: TabNode[]): TabNode[] => {
            return nodes.map(node => {
                if (node.id === parentId) {
                    return { ...node, children: [...node.children, newTabNode] };
                }
                return { ...node, children: addRecursively(node.children) };
            });
        };

        setTabsData(prev => addRecursively(prev));
    };


    const renderMainContent = () => {
        let currentLevelNodes = tabsData;
        let activeNode: TabNode | undefined = undefined;

        for (const tabId of activeTabPath) {
            activeNode = currentLevelNodes.find(n => n.id === tabId);
            if (activeNode) {
                currentLevelNodes = activeNode.children;
            } else {
                break;
            }
        }
        
        const currentTabId = activeTabPath[activeTabPath.length - 1];
        const postsForTab = postsData.filter(p => p.tabId === currentTabId && p.isEnabled);

        return (
            <>
                {activeNode && <TabBar tabs={activeNode.children} activeTabId={undefined} onTabClick={(id) => setActiveTabPath([...activeTabPath, id])} level={activeTabPath.length} />}
                
                <div className="space-y-4">
                    {postsForTab.length > 0 ? (
                        postsForTab.map((post: PostType) => <PostCard key={post.id} post={post} />)
                    ) : (
                        activeNode && activeNode.children.length === 0 && <InfoCard title={activeNode.label}>No posts yet for this section.</InfoCard>
                    )}
                     {activeNode?.id === 'vision' && <InfoCard title="विज़न">राज्य और इसके लोगों के लिए भविष्य की दृष्टि और योजनाओं से संबंधित जानकारी यहाँ प्रदर्शित की जाएगी।</InfoCard>}
                </div>
            </>
        );
    };

    if (isAdminMode) {
        return <CMSPanel 
            onExitAdminMode={() => setIsAdminMode(false)} 
            bannerData={bannerData} 
            updateBannerData={setBannerData}
            tabsData={tabsData}
            postsData={postsData}
            addPost={addPost}
            addTab={addTab}
            togglePostStatus={togglePostStatus}
        />;
    }

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-lg relative" style={{
            backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
            backgroundRepeat: 'repeat',
        }}>
            <Header onAdminClick={() => setIsAdminMode(true)} />
            <div className="flex-grow flex flex-col overflow-hidden">
                <Banner bannerUrl={bannerData.bannerUrl} />
                <ChannelInfo
                    profileUrl={bannerData.profileUrl}
                    title={bannerData.title}
                    followers={bannerData.followers}
                />
                
                <TabBar tabs={tabsData} activeTabId={activeTabPath[0]} onTabClick={(id) => setActiveTabPath([id])} level={0} />
                
                <main className="flex-grow p-4 overflow-y-auto bg-[#ECE5DD]">
                    {renderMainContent()}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default App;
