import React from 'react';

const Banner: React.FC = () => {
    return (
        <div className="bg-gray-100 flex-shrink-0">
            <img src="https://scontent-bom2-2.xx.fbcdn.net/v/t39.30808-6/476121108_1161417528681258_1226577152173553956_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=kM2lzapnYQcQ7kNvwH9wACa&_nc_oc=Adm7iCEoJm650y2Zu134aUrN7tzfzFFfbnxuBPmEwQox1wUgPqbTqSnJZrjxVpx4ParTdd68hj56huV4nfKOHP7Z&_nc_zt=23&_nc_ht=scontent-bom2-2.xx&_nc_gid=f2hkXZyXM4fBFnalx0qVsA&oh=00_AfenZ_-r7m7UC9HrXdPZCe2uZeCZAXYyfwpnGid39zPznA&oe=69097E2D" alt="Channel Banner" className="w-full h-40 object-cover" />
            <div className="p-4 relative">
                <div className="flex items-end -mt-16">
                    <img src="https://scontent-iad3-1.xx.fbcdn.net/v/t39.30808-6/447738221_1344852430337766_2245283595204128963_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=4-F-3nB1r-MQ7kNvgH0sQ51&_nc_ht=scontent-iad3-1.xx&_nc_gid=f2hkXZyXM4fBFnalx0qVsA&oh=00_AfDndv7e8g93y7s7K-5o9j6n2l9l_s5W_6g4V5z9T9H_7w&oe=667950B0" alt="Channel DP" className="rounded-full w-20 h-20 mr-4 border-4 border-white shadow-lg object-cover" />
                    <div className="flex-grow pb-2">
                        <h1 className="text-2xl font-bold text-gray-800">श्री ओपी चौधरी के काम</h1>
                        <p className="text-sm text-gray-500">1.2M followers</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;