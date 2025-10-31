import React, { useEffect, useState } from 'react';
import { PostType, TabNode, BannerType } from './types';
import Header from './components/Header';
import Banner from './components/Banner';
import ChannelInfo from './components/ChannelInfo';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import CMSPanel from './components/cms/CMSPanel';
import FirebaseConfigErrorScreen from './components/FirebaseConfigErrorScreen';
import FirebaseServiceErrorScreen from './components/FirebaseServiceErrorScreen';
import { isFirebaseConfigured, testFirebaseConnection, getAppData, setAppData } from './firebase';

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

const initialPostsData: PostType[] = [
    {
        id: 1,
        author: 'श्री ओपी चौधरी',
        handle: '@OPChoudhary',
        timestamp: '2h',
        createdAt: new Date(Date.now() - 7200000).toLocaleString(),
        content: 'आज रायपुर में आयोजित ‘विकसित भारत @ 2047’ कार्यक्रम में शामिल हुआ। प्रधानमंत्री श्री नरेंद्र मोदी जी के नेतृत्व में भारत तेजी से विकास की ओर अग्रसर है। इस कार्यक्रम में युवाओं के साथ विकसित भारत के विजन पर चर्चा की।',
        imageUrls: ['https://placehold.co/600x400/DDEEFF/333333?text=Event+Image+1'],
        profileUrl: profileImageUrl,
        stats: { comments: 12, retweets: 45, likes: 150, views: '10.2K' },
        isEnabled: true,
        tabId: 'bhent',
    },
];

const App: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [connectionError, setConnectionError] = useState<any>(null);

    const checkConnection = async () => {
        setConnectionStatus('connecting');
        const result = await testFirebaseConnection();
        if (result.success) {
            setConnectionStatus('connected');
            setConnectionError(null);
        } else {
            setConnectionStatus('error');
            setConnectionError(result.error);
        }
    };

    useEffect(() => {
        // Fix: isFirebaseConfigured is a boolean constant, not a function.
        if (isFirebaseConfigured) {
            checkConnection();
        }
    }, []);

    // Fix: isFirebaseConfigured is a boolean constant, not a function.
    if (!isFirebaseConfigured) {
        return <FirebaseConfigErrorScreen />;
    }

    if (connectionStatus === 'connecting') {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-[#075E54] dark:text-green-400"></i>
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Connecting to Database...</p>
                </div>
            </div>
        );
    }

    if (connectionStatus === 'error') {
        return <FirebaseServiceErrorScreen error={connectionError} onRetry={checkConnection} />;
    }

    return <MainAppContent />;
};

const MainAppContent: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [bannerData, setBannerData] = useState<BannerType>(initialBannerData);
    const [postsData, setPostsData] = useState<PostType[]>([]);
    const [tabsData, setTabsData] = useState<TabNode[]>(initialTabsData);
    const [activeTabPath, setActiveTabPath] = useState<string[]>(['rajya']);

    useEffect(() => {
        async function loadData() {
            const data = await getAppData();
            if (data) {
                setBannerData(data.bannerData || initialBannerData);
                setPostsData(data.postsData || []);
                setTabsData(data.tabsData || initialTabsData);
                 // Also load local UI state if needed
                setIsAdminMode(JSON.parse(localStorage.getItem('isAdminMode') || 'false'));
                setActiveTabPath(JSON.parse(localStorage.getItem('app-activeTabPath') || '["rajya"]'));
            } else {
                // First time use, save initial data to Firebase
                await setAppData({ 
                    bannerData: initialBannerData, 
                    postsData: initialPostsData,
                    tabsData: initialTabsData
                });
                setBannerData(initialBannerData);
                setPostsData(initialPostsData);
                setTabsData(initialTabsData);
            }
            setIsLoading(false);
        }
        loadData();
    }, []);

    // Save entire app state to Firebase.
    const saveState = async (updates: { banner?: BannerType, posts?: PostType[], tabs?: TabNode[] }) => {
        const newState = {
            bannerData: updates.banner || bannerData,
            postsData: updates.posts || postsData,
            tabsData: updates.tabs || tabsData,
        };
        await setAppData(newState);
    };

    // UI state persistence (localStorage is fine for this)
    const setPersistentAdminMode = (value: boolean) => {
        setIsAdminMode(value);
        localStorage.setItem('isAdminMode', JSON.stringify(value));
    };

    const setPersistentActiveTabPath = (path: string[]) => {
        setActiveTabPath(path);
        localStorage.setItem('app-activeTabPath', JSON.stringify(path));
    };
    
    // CRUD functions that now update state and save to Firebase
    const updateBannerDataWithSave = (newData: BannerType) => {
        setBannerData(newData);
        saveState({ banner: newData });
    };

    const updatePostsDataWithSave = (newData: PostType[]) => {
        setPostsData(newData);
        saveState({ posts: newData });
    };

    const updateTabsDataWithSave = (newData: TabNode[]) => {
        setTabsData(newData);
        saveState({ tabs: newData });
    };

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
        const newPosts = [newPost, ...postsData];
        updatePostsDataWithSave(newPosts);
    };
    
    const togglePostStatus = (postId: number) => {
        const newPosts = postsData.map(post => 
            post.id === postId ? { ...post, isEnabled: !post.isEnabled } : post
        );
        updatePostsDataWithSave(newPosts);
    };
    
    const addTab = (parentId: string | null, newTab: Omit<TabNode, 'children'>) => {
        const newTabNode: TabNode = { ...newTab, children: [] };
        
        if (parentId === null) {
            updateTabsDataWithSave([...tabsData, newTabNode]);
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
        
        updateTabsDataWithSave(addRecursively(tabsData));
    };


    const getAllLeafTabIds = (node: TabNode): string[] => {
        if (!node.children || node.children.length === 0) return [node.id];
        return node.children.flatMap(child => getAllLeafTabIds(child));
    };

    const TabBar: React.FC<{tabs: TabNode[]; activeTabId: string | undefined; onTabClick: (id: string) => void; level: number;}> = ({ tabs, activeTabId, onTabClick, level }) => {
        if (tabs.length === 0) return null;
        if (level === 0) return (
            <nav className="bg-[#075E54] dark:bg-gray-800 text-gray-300 font-medium flex-shrink-0">
                <div className="flex justify-around">{tabs.map(tab => (<button key={tab.id} onClick={() => onTabClick(tab.id)} className={`flex-1 py-3 text-sm uppercase tracking-wide transition-colors duration-200 ${ activeTabId === tab.id ? 'border-b-4 border-white text-white' : 'hover:bg-white/10'}`}>{tab.label}</button>))}</div>
            </nav>
        );
        return (<div className="flex-shrink-0 flex overflow-x-auto space-x-2 p-2 bg-gray-100 dark:bg-gray-700/50">{tabs.map(tab => (<button key={tab.id} onClick={() => onTabClick(tab.id)} className={`whitespace-nowrap border px-4 py-1 rounded-full text-sm transition-colors duration-200 ${ activeTabId === tab.id ? 'bg-[#DCF8C6] dark:bg-green-400 text-gray-800 dark:text-black border-transparent font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{tab.label}</button>))}</div>);
    };

    const renderSubTabBars = () => {
        if (!activeTabPath.length) return null;
        const bars = [];
        let currentLevelNodes = tabsData;
        for (let i = 0; i < activeTabPath.length; i++) {
            const activeId = activeTabPath[i];
            const activeNode = currentLevelNodes.find(n => n.id === activeId);
            if (!activeNode || !activeNode.children || activeNode.children.length === 0) break;
            const handleSubTabClick = (clickedId: string) => setPersistentActiveTabPath([...activeTabPath.slice(0, i + 1), clickedId]);
            bars.push(<TabBar key={`sub-tab-bar-${i}`} tabs={activeNode.children} activeTabId={activeTabPath[i + 1]} onTabClick={handleSubTabClick} level={i + 1} />);
            currentLevelNodes = activeNode.children;
        }
        return bars;
    };

    const renderMainContent = () => {
        let currentLevelNodes = tabsData;
        let nodeForPosts: TabNode | undefined = undefined;
        for (const tabId of activeTabPath) {
            nodeForPosts = currentLevelNodes.find(n => n.id === tabId);
            if (nodeForPosts) currentLevelNodes = nodeForPosts.children;
            else break;
        }
        if (!nodeForPosts) return null;
        const leafIds = getAllLeafTabIds(nodeForPosts);
        const postsForTimeline = postsData.filter(p => leafIds.includes(p.tabId) && p.isEnabled).sort((a, b) => b.id - a.id);
        return (<div className="space-y-4">{postsForTimeline.length > 0 ? (postsForTimeline.map(post => <PostCard key={post.id} post={post} />)) : (<div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"><p className="text-sm text-gray-600 dark:text-gray-300">No posts yet for this section.</p></div>)}</div>);
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900"><div className="text-center"><i className="fas fa-spinner fa-spin text-4xl text-[#075E54] dark:text-green-400"></i><p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Channel...</p></div></div>;
    }

    if (isAdminMode) {
        return <CMSPanel onExitAdminMode={() => setPersistentAdminMode(false)} bannerData={bannerData} updateBannerData={updateBannerDataWithSave} tabsData={tabsData} postsData={postsData} addPost={addPost} addTab={addTab} togglePostStatus={togglePostStatus} updatePostsData={updatePostsDataWithSave} updateTabsData={updateTabsDataWithSave} />;
    }

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg relative" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')", backgroundRepeat: 'repeat' }}>
            <Header onAdminClick={() => setPersistentAdminMode(true)} />
            <div className="flex-grow flex flex-col overflow-hidden">
                <Banner bannerUrl={bannerData.bannerUrl} />
                <ChannelInfo profileUrl={bannerData.profileUrl} title={bannerData.title} followers={bannerData.followers} />
                <TabBar tabs={tabsData} activeTabId={activeTabPath[0]} onTabClick={(id) => setPersistentActiveTabPath([id])} level={0} />
                {renderSubTabBars()}
                <main className="flex-grow p-4 overflow-y-auto bg-[#ECE5DD] dark:bg-gray-900/80 backdrop-blur-sm">{renderMainContent()}</main>
            </div>
            <Footer />
        </div>
    );
};

export default App;