
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
    content: string;
    imageUrl: string;
    profileUrl: string;
    stats: PostStats;
}

export interface TabType {
    id: string;
    label: string;
}
