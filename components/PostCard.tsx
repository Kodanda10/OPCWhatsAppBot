
import React from 'react';
import { PostType } from '../types';

interface PostCardProps {
    post: PostType;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 flex items-center">
                <img src={post.profileUrl} alt="Profile" className="w-12 h-12 rounded-full mr-3 object-cover" />
                <div>
                    <span className="font-bold text-gray-800">{post.author}</span>
                    <span className="text-sm text-gray-500 block">{post.handle} • {post.timestamp}</span>
                </div>
            </div>
            <div className="px-3 pb-3">
                <p className="text-gray-800 mb-3">{post.content}</p>
                <img src={post.imageUrl} alt="Post content" className="mt-3 rounded-lg w-full object-cover" />
            </div>
            <div className="flex justify-around p-2 border-t border-gray-200 text-gray-500 text-sm">
                <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                    <i className="far fa-comment"></i> <span>{post.stats.comments}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                    <i className="fas fa-retweet"></i> <span>{post.stats.retweets}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                    <i className="far fa-heart"></i> <span>{post.stats.likes}</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                    <i className="far fa-chart-bar"></i> <span>{post.stats.views}</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
