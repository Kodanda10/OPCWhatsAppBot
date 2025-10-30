
import React, { useState } from 'react';
import { PostType, TabType } from './types';
import { 
    MAIN_TABS, 
    RAJYA_SUB_TABS, 
    RAIGARH_SUB_TABS,
    REFORMS_SUB_TABS,
    YOJANAYE_NESTED_TABS,
    VITT_POSTS
} from './constants';
import Header from './components/Header';
import Banner from './components/Banner';
import Footer from './components/Footer';
import PostCard from './components/PostCard';

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

    const renderMainContent = () => {
        switch (activeMainTab) {
            case 'rajya':
                return (
                    <div>
                        <SubTabs tabs={RAJYA_SUB_TABS} activeTab={activeSubTabs.rajya} onTabClick={(id) => handleSubTabClick('rajya', id)} />
                        {activeSubTabs.rajya === 'vitt' && (
                            <div className="space-y-4">
                                {VITT_POSTS.map((post: PostType) => <PostCard key={post.id} post={post} />)}
                            </div>
                        )}
                        {activeSubTabs.rajya === 'yojanaye' && (
                            <div>
                                <NestedSubTabs tabs={YOJANAYE_NESTED_TABS} activeTab={activeNestedTabs.yojanaye} onTabClick={(id) => handleNestedTabClick('yojanaye', id)} />
                                {activeNestedTabs.yojanaye === 'pmay' && <InfoCard title="प्रधानमंत्री आवास योजना-ग्रामीण">इस योजना के तहत ग्रामीण क्षेत्रों में पक्के मकान बनाने के लिए वित्तीय सहायता प्रदान की जाती है।</InfoCard>}
                                {activeNestedTabs.yojanaye === 'mahatari' && <InfoCard title="महतारी वंदन योजना">इस योजना के तहत राज्य की पात्र विवाहित महिलाओं को वित्तीय सहायता प्रदान की जाती है।</InfoCard>}
                            </div>
                        )}
                        {activeSubTabs.rajya === 'vyapar' && <InfoCard title="व्यापार कर / वाणिज्य कर">व्यापार और वाणिज्य कर सुधारों और नीतियों पर नवीनतम जानकारी।</InfoCard>}
                        {activeSubTabs.rajya === 'awas' && <InfoCard title="आवास और पर्यावरण योजना">किफायती आवास और पर्यावरणीय स्थिरता के लिए पहल का विवरण।</InfoCard>}
                        {activeSubTabs.rajya === 'arth' && <InfoCard title="अर्थशास्त्र एवं सांख्यिकी">राज्य के लिए आर्थिक योजना और सांख्यिकीय विश्लेषण पर अपडेट।</InfoCard>}
                    </div>
                );
            case 'raigarh':
                return (
                    <div>
                        <SubTabs tabs={RAIGARH_SUB_TABS} activeTab={activeSubTabs.raigarh} onTabClick={(id) => handleSubTabClick('raigarh', id)} />
                        {activeSubTabs.raigarh === 'vikas' && <InfoCard title="विकास कार्य">रायगढ़ में चल रहे और पूरे हो चुके विकास कार्यों का विवरण।</InfoCard>}
                        {activeSubTabs.raigarh === 'bhent' && <InfoCard title="भेंट/समारोह">सार्वजनिक बैठकों, कार्यक्रमों और समारोहों की झलकियाँ।</InfoCard>}
                    </div>
                );
            case 'reforms':
                 return (
                    <div>
                        <SubTabs tabs={REFORMS_SUB_TABS} activeTab={activeSubTabs.reforms} onTabClick={(id) => handleSubTabClick('reforms', id)} />
                        {activeSubTabs.reforms === 'scr' && <InfoCard title="SCR (स्टेट कैपिटल रीजन)">राज्य राजधानी क्षेत्र के विकास से संबंधित सुधारों की जानकारी।</InfoCard>}
                        {activeSubTabs.reforms === 'registry' && <InfoCard title="रजिस्ट्री - स्मार्ट पंजीयन">पंजीकरण प्रक्रियाओं को सरल बनाने के लिए स्मार्ट रजिस्ट्री पहल पर अपडेट।</InfoCard>}
                    </div>
                );
            case 'vision':
                return <InfoCard title="विज़न">राज्य और इसके लोगों के लिए भविष्य की दृष्टि और योजनाओं से संबंधित जानकारी यहाँ प्रदर्शित की जाएगी।</InfoCard>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-lg" style={{
            backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
            backgroundRepeat: 'repeat',
        }}>
            <Header />
            <div className="flex-grow flex flex-col overflow-hidden">
                <Banner />
                <nav className="bg-[#075E54] text-gray-300 font-medium flex-shrink-0">
                    <div className="flex justify-around">
                        {MAIN_TABS.map(tab => (
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
