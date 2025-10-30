import { TabType } from './types';

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
