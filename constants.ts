import { PostType, TabType } from './types';

export const MAIN_TABS: TabType[] = [
    { id: 'rajya', label: 'राज्य' },
    { id: 'raigarh', label: 'रायगढ़' },
    { id: 'reforms', label: 'रिफॉर्म्स' },
    { id: 'vision', label: 'विज़न' },
];

export const RAJYA_SUB_TABS: TabType[] = [
    { id: 'vitt', label: 'वित्त' },
    { id: 'yojanaye', label: 'योजनाएं' },
    { id: 'vyapar', label: 'व्यापार कर / वाणिज्य कर' },
    { id: 'awas', label: 'आवास और पर्यावरण योजना' },
    { id: 'arth', label: 'अर्थशास्त्र एवं सांख्यिकी' },
];

export const RAIGARH_SUB_TABS: TabType[] = [
    { id: 'vikas', label: 'विकास कार्य' },
    { id: 'bhent', label: 'भेंट/समारोह' },
];

export const REFORMS_SUB_TABS: TabType[] = [
    { id: 'scr', label: 'SCR (स्टेट कैपिटल रीजन)' },
    { id: 'registry', label: 'रजिस्ट्री - स्मार्ट पंजीयन' },
];

export const YOJANAYE_NESTED_TABS: TabType[] = [
    { id: 'pmay', label: 'प्रधानमंत्री आवास योजना-ग्रामीण' },
    { id: 'mahatari', label: 'महतारी वंदन योजना' },
];

const profileImageUrl = 'https://scontent-iad3-1.xx.fbcdn.net/v/t39.30808-6/447738221_1344852430337766_2245283595204128963_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=4-F-3nB1r-MQ7kNvgH0sQ51&_nc_ht=scontent-iad3-1.xx&_nc_gid=f2hkXZyXM4fBFnalx0qVsA&oh=00_AfDndv7e8g93y7s7K-5o9j6n2l9l_s5W_6g4V5z9T9H_7w&oe=667950B0';

export const VITT_POSTS: PostType[] = [
    {
        id: 1,
        author: 'श्री ओपी चौधरी',
        handle: '@OPChoudhary',
        timestamp: '2h',
        content: "आज विधानसभा में छत्तीसगढ़ का वित्तीय वर्ष 2024-25 का बजट पेश किया। यह बजट 'विकसित भारत' के संकल्प में 'विकसित छत्तीसगढ़' के योगदान को सुनिश्चित करने वाला बजट है।",
        imageUrl: 'https://picsum.photos/seed/budget1/600/400',
        profileUrl: profileImageUrl,
        stats: { comments: 15, retweets: 42, likes: 210, views: '18K' },
    },
    {
        id: 2,
        author: 'श्री ओपी चौधरी',
        handle: '@OPChoudhary',
        timestamp: '1d',
        content: "हमारी सरकार 'ज्ञान' (गरीब, युवा, अन्नदाता, नारी) पर केंद्रित है। यह बजट राज्य के किसानों को सशक्त बनाएगा और युवाओं के लिए नए अवसर पैदा करेगा। #CGBudget2024",
        imageUrl: 'https://picsum.photos/seed/farmer/600/400',
        profileUrl: profileImageUrl,
        stats: { comments: 22, retweets: 58, likes: 305, views: '25K' },
    },
];