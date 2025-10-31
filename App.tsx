import React, { useEffect, useState } from 'react';
import { PostType, TabNode, BannerType } from './types';
import Header from './components/Header';
import Banner from './components/Banner';
import ChannelInfo from './components/ChannelInfo';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import CMSPanel from './components/cms/CMSPanel';
import { get, set } from './hooks/usePersistentState';

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

// Gets all leaf node IDs from a given starting node
const getAllLeafTabIds = (node: TabNode): string[] => {
    if (!node.children || node.children.length === 0) {
        return [node.id];
    }
    
    let ids: string[] = [];
    for (const child of node.children) {
        ids.push(...getAllLeafTabIds(child));
    }
    return ids;
};


const TabBar: React.FC<{
    tabs: TabNode[];
    activeTabId: string | undefined;
    onTabClick: (id: string) => void;
    level: number;
}> = ({ tabs, activeTabId, onTabClick, level }) => {
    if (tabs.length === 0) return null;

    if (level === 0) { // Main tabs
        return (
             <nav className="bg-[#075E54] dark:bg-gray-800 text-gray-300 font-medium flex-shrink-0">
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
        <div className="flex-shrink-0 flex overflow-x-auto space-x-2 p-2 bg-gray-100 dark:bg-gray-700/50">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`whitespace-nowrap border px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
                        activeTabId === tab.id
                            ? 'bg-[#DCF8C6] dark:bg-green-400 text-gray-800 dark:text-black border-transparent font-semibold'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
        <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>
    </div>
);


const App: React.FC = () => {
    // App loading state
    const [isLoading, setIsLoading] = useState(true);

    // CMS State
    const [isAdminMode, setIsAdminMode] = useState(false);

    // Content State
    const [bannerData, setBannerData] = useState<BannerType>(initialBannerData);
    const [postsData, setPostsData] = useState<PostType[]>([]);
    const [tabsData, setTabsData] = useState<TabNode[]>(initialTabsData);
    
    // UI State
    const [activeTabPath, setActiveTabPath] = useState<string[]>(['rajya']);

    // Effect to load all data from IndexedDB on initial mount
    useEffect(() => {
        async function loadDataFromDB() {
            const [banner, posts, tabs, adminMode, path] = await Promise.all([
                get<BannerType>('app-bannerData'),
                get<PostType[]>('app-postsData'),
                get<TabNode[]>('app-tabsData'),
                get<boolean>('isAdminMode'),
                get<string[]>('app-activeTabPath'),
            ]);

            if (banner) setBannerData(banner);
            if (posts) setPostsData(posts);
            if (tabs) setTabsData(tabs);
            if (adminMode) setIsAdminMode(adminMode);
            if (path) setActiveTabPath(path);
            
            setIsLoading(false);
        }
        loadDataFromDB();
    }, []);


    // Effect to listen for system theme changes and apply them
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // --- State persistence wrappers ---
    const setPersistentAdminMode = (value: boolean | ((prevState: boolean) => boolean)) => {
        const newValue = typeof value === 'function' ? value(isAdminMode) : value;
        setIsAdminMode(newValue);
        set('isAdminMode', newValue);
    };

    const setPersistentActiveTabPath = (value: string[] | ((prevState: string[]) => string[])) => {
        const newValue = typeof value === 'function' ? value(activeTabPath) : value;
        setActiveTabPath(newValue);
        set('app-activeTabPath', newValue);
    };

    const setPersistentBannerData = (value: BannerType | ((prevState: BannerType) => BannerType)) => {
        const newValue = typeof value === 'function' ? value(bannerData) : value;
        setBannerData(newValue);
        set('app-bannerData', newValue);
    };
    
    const setPersistentPostsData = (value: PostType[] | ((prevState: PostType[]) => PostType[])) => {
        const newValue = typeof value === 'function' ? value(postsData) : value;
        setPostsData(newValue);
        set('app-postsData', newValue);
    };
    
    const setPersistentTabsData = (value: TabNode[] | ((prevState: TabNode[]) => TabNode[])) => {
        const newValue = typeof value === 'function' ? value(tabsData) : value;
        setTabsData(newValue);
        set('app-tabsData', newValue);
    };


    // --- CRUD functions ---
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
        setPersistentPostsData(prev => [newPost, ...prev]);
    };
    
    const togglePostStatus = (postId: number) => {
        setPersistentPostsData(prev => prev.map(post => 
            post.id === postId ? { ...post, isEnabled: !post.isEnabled } : post
        ));
    };
    
    const addTab = (parentId: string | null, newTab: Omit<TabNode, 'children'>) => {
        const newTabNode: TabNode = { ...newTab, children: [] };
        
        if (parentId === null) {
            setPersistentTabsData(prev => [...prev, newTabNode]);
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

        setPersistentTabsData(prev => addRecursively(prev));
    };

    const renderSubTabBars = () => {
        if (!activeTabPath.length) return null;

        const bars = [];
        let currentLevelNodes = tabsData;

        for (let i = 0; i < activeTabPath.length; i++) {
            const activeId = activeTabPath[i];
            const activeNode = currentLevelNodes.find(n => n.id === activeId);

            if (!activeNode || !activeNode.children || activeNode.children.length === 0) {
                break;
            }

            const handleSubTabClick = (clickedId: string) => {
                const newPath = [...activeTabPath.slice(0, i + 1), clickedId];
                setPersistentActiveTabPath(newPath);
            };

            bars.push(
                <TabBar
                    key={`sub-tab-bar-${i}`}
                    tabs={activeNode.children}
                    activeTabId={activeTabPath[i + 1]}
                    onTabClick={handleSubTabClick}
                    level={i + 1}
                />
            );
            currentLevelNodes = activeNode.children;
        }
        return bars;
    };

    const renderMainContent = () => {
        let currentLevelNodes = tabsData;
        let nodeForPosts: TabNode | undefined = undefined;

        for (const tabId of activeTabPath) {
            nodeForPosts = currentLevelNodes.find(n => n.id === tabId);
            if (nodeForPosts) {
                currentLevelNodes = nodeForPosts.children;
            } else {
                break;
            }
        }
        
        let postsForTimeline: PostType[] = [];
        if (nodeForPosts) {
            const leafIds = getAllLeafTabIds(nodeForPosts);
            postsForTimeline = postsData
                .filter(p => leafIds.includes(p.tabId) && p.isEnabled)
                .sort((a, b) => b.id - a.id);
        }

        return (
            <div className="space-y-4">
                 {nodeForPosts && !['reforms', 'vision'].includes(activeTabPath[0]) && (
                    <div className="mb-2 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-sm backdrop-blur-sm border-l-4 border-green-500">
                        <h2 className="font-bold text-gray-800 dark:text-gray-200">
                            Viewing posts in: <span className="text-green-700 dark:text-green-400">{nodeForPosts.label}</span>
                        </h2>
                        {nodeForPosts.children.length > 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This includes all sub-categories. Select a sub-category above to filter the view.</p>}
                    </div>
                )}

                {postsForTimeline.length > 0 ? (
                    postsForTimeline.map((post: PostType) => <PostCard key={post.id} post={post} />)
                ) : (
                    nodeForPosts && nodeForPosts.children.length === 0 && <InfoCard title={nodeForPosts.label}>No posts yet for this section.</InfoCard>
                )}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-[#075E54] dark:text-green-400"></i>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Channel...</p>
                </div>
            </div>
        );
    }


    if (isAdminMode) {
        return <CMSPanel 
            onExitAdminMode={() => setPersistentAdminMode(false)} 
            bannerData={bannerData} 
            updateBannerData={setPersistentBannerData}
            tabsData={tabsData}
            postsData={postsData}
            addPost={addPost}
            addTab={addTab}
            togglePostStatus={togglePostStatus}
            updatePostsData={setPersistentPostsData}
            updateTabsData={setPersistentTabsData}
        />;
    }

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg relative" style={{
            backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
            backgroundRepeat: 'repeat',
        }}>
            <Header onAdminClick={() => setPersistentAdminMode(true)} />
            <div className="flex-grow flex flex-col overflow-hidden">
                <Banner bannerUrl={bannerData.bannerUrl} />
                <ChannelInfo
                    profileUrl={bannerData.profileUrl}
                    title={bannerData.title}
                    followers={bannerData.followers}
                />
                
                <TabBar tabs={tabsData} activeTabId={activeTabPath[0]} onTabClick={(id) => setPersistentActiveTabPath([id])} level={0} />
                
                {renderSubTabBars()}

                <main className="flex-grow p-4 overflow-y-auto bg-[#ECE5DD] dark:bg-gray-900/80 backdrop-blur-sm">
                    {renderMainContent()}
                </main>
            </div>
            <Footer />
        </div>
    );
};


export default App;