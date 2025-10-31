// types.ts

export interface PostStats {
    comments: number;
    retweets: number;
    likes: number;
    views: string;
}

export interface PostType {
    id: number;
    author: string;
    handle: string;
    timestamp: string;
    createdAt: string; // Added for timestamping
    content: string;
    imageUrls?: string[];
    videoUrl?: string;
    profileUrl: string;
    stats: PostStats;
    isEnabled: boolean; // Controls visibility on the timeline
    tabId: string; // To know which tab it belongs to (renamed from subTabId)
}

// Replaces the flat TabType with a recursive structure for infinite nesting
export interface TabNode {
    id: string;
    label: string;
    children: TabNode[];
}


export interface BannerType {
    bannerUrl: string;
    profileUrl: string;
    title: string;
    followers: string;
}

export interface ExportedData {
    bannerData: BannerType;
    postsData: PostType[];
    tabsData: TabNode[];
}