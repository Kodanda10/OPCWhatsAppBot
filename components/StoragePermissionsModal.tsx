import React from 'react';
import { firebaseConfig } from '../../firebaseConfig';

interface StoragePermissionsModalProps {
    onClose: () => void;
}

const StoragePermissionsModal: React.FC<StoragePermissionsModalProps> = ({ onClose }) => {
    const projectId = firebaseConfig.projectId;
    const storageRulesUrl = `https://console.firebase.google.com/project/${projectId}/storage/rules`;
    const storageRules = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow read and write access to everyone for the demo.
      allow read, write: if true;
    }
  }
}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border-t-4 border-yellow-500 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close">
                    <i className="fas fa-times text-2xl"></i>
                </button>
                <div className="text-center mb-6">
                    <i className="fas fa-file-upload text-4xl text-yellow-500 mb-3"></i>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">File Upload Permissions Needed</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Your app is connected, but Firebase's **Storage** security rules are blocking uploads. Please follow these steps to fix it.
                    </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white"><span className="bg-yellow-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>Confirm Your Project ID</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Ensure the project you are editing in the Firebase Console matches this ID.
                    </p>
                    <div className="mt-2 bg-white dark:bg-gray-800 p-2 rounded text-center">
                        <code className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-lg">{projectId}</code>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600 mt-4">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white"><span className="bg-yellow-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>Fix File Storage Rules</h2>
                    <a href={storageRulesUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">A. Open Storage Rules Editor</a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">B. Delete everything, then copy & paste the code below.</p>
                    <div className="relative mt-2">
                        <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded-md overflow-x-auto"><code>{storageRules}</code></pre>
                        <button onClick={() => copyToClipboard(storageRules)} className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">C. Click the blue <strong className="text-gray-800 dark:text-gray-200">Publish</strong> button.</p>
                </div>
                 <div className="mt-8 text-center">
                    <button onClick={onClose} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-lg">
                        I've fixed it, let me try again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoragePermissionsModal;
