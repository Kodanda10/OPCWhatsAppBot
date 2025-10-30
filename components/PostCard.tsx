import React, { useState } from 'react';
import { PostType } from '../types';

interface PostCardProps {
    post: PostType;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasImages = post.imageUrls && post.imageUrls.length > 0;
    const hasMultipleImages = hasImages && post.imageUrls!.length > 1;

    const goToPrevious = () => {
        const isFirstImage = currentImageIndex === 0;
        const newIndex = isFirstImage ? post.imageUrls!.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentImageIndex === post.imageUrls!.length - 1;
        const newIndex = isLastImage ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-3 flex items-center">
                <img src={post.profileUrl} alt="Profile" className="w-12 h-12 rounded-full mr-3 object-cover" />
                <div>
                    <span className="font-bold text-gray-800">{post.author}</span>
                    <span className="text-sm text-gray-500 block">{post.handle} • {post.timestamp} ({post.createdAt})</span>
                </div>
            </div>
            <div className="px-3 pb-3">
                <p className="text-gray-800 mb-3">{post.content}</p>
                {hasImages && (
                    <div className="mt-3 rounded-lg w-full object-cover relative">
                        <img src={post.imageUrls![currentImageIndex]} alt={`Post content ${currentImageIndex + 1}`} className="w-full rounded-lg" />
                        {hasMultipleImages && (
                            <>
                                <button onClick={goToPrevious} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-opacity">
                                    &#10094;
                                </button>
                                <button onClick={goToNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition-opacity">
                                    &#10095;
                                </button>
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {post.imageUrls!.map((_, index) => (
                                        <div key={index} className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
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
