import React, { useState } from 'react';
import { PostType, TabType, BannerType } from './types';
import { 
    MAIN_TABS, 
    RAJYA_SUB_TABS, 
    RAIGARH_SUB_TABS,
    REFORMS_SUB_TABS,
    YOJANAYE_NESTED_TABS,
} from './constants';
import Header from './components/Header';
import Banner from './components/Banner';
import ChannelInfo from './components/ChannelInfo';
import Footer from './components/Footer';
import PostCard from './components/PostCard';
import CMSPanel from './components/cms/CMSPanel';

// Stable Placeholder Images
const profileImageUrl = 'https://placehold.co/100x100/EFEFEF/333333?text=DP';
const bannerImageUrl = 'https://placehold.co/600x200/CCCCCC/FFFFFF?text=Channel+Banner';

const initialVittPosts: PostType[] = [
    {
        id: 1,
        author: 'श्री ओपी चौधरी',
        handle: '@OPChoudhary',
        timestamp: '2h',
        content: "आज विधानसभा में छत्तीसगढ़ का वित्तीय वर्ष 2024-25 का बजट पेश किया। यह बजट 'विकसित भारत' के संकल्प में 'विकसित छत्तीसगढ़' के योगदान को सुनिश्चित करने वाला बजट है।",
        imageUrls: ['https://placehold.co/600x400/EDEDED/333?text=Image+1', 'https://placehold.co/600x400/FAFAFA/333?text=Image+2'],
        profileUrl: profileImageUrl,
        stats: { comments: 15, retweets: 42, likes: 210, views: '18K' },
    },
    {
        id: 2,
        author: 'श्री ओपी चौधरी',
        handle: '@OPChoudhary',
        timestamp: '1d',
        content: "हमारी सरकार 'ज्ञान' (गरीब, युवा, अन्नदाता, नारी) पर केंद्रित है। यह बजट राज्य के किसानों को सशक्त बनाएगा और युवाओं के लिए नए अवसर पैदा करेगा। #CGBudget2024",
        imageUrls: ['https://placehold.co/600x400/F5F5F5/333?text=Image+3'],
        profileUrl: profileImageUrl,
        stats: { comments: 22, retweets: 58, likes: 305, views: '25K' },
    },
];

const initialBannerData: BannerType = {
    bannerUrl: bannerImageUrl,
    profileUrl: profileImageUrl,
    title: "श्री ओपी चौधरी के काम",
    followers: "1.2M followers"
};

// All Tabs data structure
interface AllTabs {
    main: TabType[];
    rajya: TabType[];
    raigarh: TabType[];
    reforms: TabType[];
    yojanaye: TabType[];
}

const initialTabsData: AllTabs = {
    main: MAIN_TABS,
    rajya: RAJYA_SUB_TABS,
    raigarh: RAIGARH_SUB_TABS,
    reforms: REFORMS_SUB_TABS,
    yojanaye: YOJANAYE_NESTED_TABS,
}

const SubTabs: React.FC<{
    tabs: TabType[];
    activeTab: string;
    onTabClick: (id: string) => void;
}> = ({ tabs, activeTab, onTabClick }) => (
    <div className="flex overflow-x-auto space-x-2 p-2 mb-4 bg-gray-100 rounded-lg">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`whitespace-nowrap border px-4 py-1 rounded-full text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                        ? 'bg-[#DCF8C6] text-gray-800 border-[#DCF8C6]'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

const NestedSubTabs: React.FC<{
    tabs: TabType[];
    activeTab: string;
    onTabClick: (id: string) => void;
}> = ({ tabs, activeTab, onTabClick }) => (
    <div className="flex justify-start flex-wrap gap-2 mb-4 pl-2">
        {tabs.map(tab => (
            <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`border px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                        ? 'bg-[#c6f8dc] text-gray-800 border-[#c6f8dc]'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

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
    const [postsData, setPostsData] = useState<Record<string, PostType[]>>({ vitt: initialVittPosts });
    const [tabsData, setTabsData] = useState<AllTabs>(initialTabsData);
    
    // UI State
    const [activeMainTab, setActiveMainTab] = useState<string>('rajya');
    const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({
        rajya: 'vitt',
        raigarh: 'vikas',
        reforms: 'scr',
    });
    const [activeNestedTabs, setActiveNestedTabs] = useState<Record<string, string>>({
        yojanaye: 'pmay',
    });

    const handleSubTabClick = (mainTab: string, subTab: string) => {
        setActiveSubTabs(prev => ({ ...prev, [mainTab]: subTab }));
    };

    const handleNestedTabClick = (subTab: string, nestedTab: string) => {
        setActiveNestedTabs(prev => ({...prev, [subTab]: nestedTab}));
    }
    
    // CMS Handlers
    const updateBannerData = (newData: BannerType) => {
        setBannerData(newData);
    };

    const addPost = (subTabId: string, newPostContent: Omit<PostType, 'id' | 'timestamp' | 'profileUrl' | 'stats' | 'author' | 'handle'>) => {
        const newPost: PostType = {
            id: Date.now(),
            author: 'श्री ओपी चौधरी',
            handle: '@OPChoudhary',
            timestamp: 'Just now',
            profileUrl: bannerData.profileUrl,
            stats: { comments: 0, retweets: 0, likes: 0, views: '0' },
            ...newPostContent,
        };

        setPostsData(prev => ({
            ...prev,
            [subTabId]: [newPost, ...(prev[subTabId] || [])]
        }));
    };

    const addSubTab = (mainTabId: keyof AllTabs, newTab: TabType) => {
        if (mainTabId === 'main' || mainTabId === 'yojanaye') return; // For simplicity, don't add to main or nested tabs for now
        
        setTabsData(prev => ({
            ...prev,
            [mainTabId]: [...prev[mainTabId], newTab]
        }));
    };

    const renderMainContent = () => {
        const activeSubTabId = activeSubTabs[activeMainTab];
        const postsForSubTab = postsData[activeSubTabId] || [];

        switch (activeMainTab) {
            case 'rajya':
                return (
                    <div>
                        <SubTabs tabs={tabsData.rajya} activeTab={activeSubTabId} onTabClick={(id) => handleSubTabClick('rajya', id)} />
                        {activeSubTabId === 'yojanaye' ? (
                            <div>
                                <NestedSubTabs tabs={tabsData.yojanaye} activeTab={activeNestedTabs.yojanaye} onTabClick={(id) => handleNestedTabClick('yojanaye', id)} />
                                {activeNestedTabs.yojanaye === 'pmay' && <InfoCard title="प्रधानमंत्री आवास योजना-ग्रामीण">इस योजना के तहत ग्रामीण क्षेत्रों में पक्के मकान बनाने के लिए वित्तीय सहायता प्रदान की जाती है।</InfoCard>}
                                {activeNestedTabs.yojanaye === 'mahatari' && <InfoCard title="महतारी वंदन योजना">इस योजना के तहत राज्य की पात्र विवाहित महिलाओं को वित्तीय सहायता प्रदान की जाती है।</InfoCard>}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {postsForSubTab.length > 0 
                                    ? postsForSubTab.map((post: PostType) => <PostCard key={post.id} post={post} />)
                                    : <InfoCard title={tabsData.rajya.find(t=>t.id === activeSubTabId)?.label || 'Info'}>No posts yet for this section.</InfoCard>}
                            </div>
                        )}
                    </div>
                );
            case 'raigarh':
                 return (
                    <div>
                        <SubTabs tabs={tabsData.raigarh} activeTab={activeSubTabId} onTabClick={(id) => handleSubTabClick('raigarh', id)} />
                        <div className="space-y-4">
                            {postsForSubTab.length > 0 
                                ? postsForSubTab.map((post: PostType) => <PostCard key={post.id} post={post} />)
                                : <InfoCard title={tabsData.raigarh.find(t=>t.id === activeSubTabId)?.label || 'Info'}>No posts yet for this section.</InfoCard>}
                        </div>
                    </div>
                );
            case 'reforms':
                 return (
                    <div>
                        <SubTabs tabs={tabsData.reforms} activeTab={activeSubTabId} onTabClick={(id) => handleSubTabClick('reforms', id)} />
                        <div className="space-y-4">
                             {postsForSubTab.length > 0 
                                ? postsForSubTab.map((post: PostType) => <PostCard key={post.id} post={post} />)
                                : <InfoCard title={tabsData.reforms.find(t=>t.id === activeSubTabId)?.label || 'Info'}>No posts yet for this section.</InfoCard>}
                        </div>
                    </div>
                );
            case 'vision':
                return <InfoCard title="विज़न">राज्य और इसके लोगों के लिए भविष्य की दृष्टि और योजनाओं से संबंधित जानकारी यहाँ प्रदर्शित की जाएगी।</InfoCard>;
            default:
                return null;
        }
    };

    if (isAdminMode) {
        return <CMSPanel 
            onExitAdminMode={() => setIsAdminMode(false)} 
            bannerData={bannerData} 
            updateBannerData={updateBannerData}
            tabsData={tabsData}
            addPost={addPost}
            addSubTab={addSubTab}
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
                <nav className="bg-[#075E54] text-gray-300 font-medium flex-shrink-0">
                    <div className="flex justify-around">
                        {tabsData.main.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveMainTab(tab.id)}
                                className={`flex-1 py-3 text-sm uppercase tracking-wide transition-colors duration-200 ${
                                    activeMainTab === tab.id ? 'border-b-4 border-white text-white' : 'hover:bg-white/10'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </nav>
                <main className="flex-grow p-4 overflow-y-auto bg-[#ECE5DD]">
                    {renderMainContent()}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default App;
