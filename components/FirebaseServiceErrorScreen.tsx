import React from 'react';
import { firebaseConfig } from '../firebaseConfig';

interface FirebaseServiceErrorScreenProps {
    error: any;
    onRetry: () => void;
}

const isPermissionError = (error: any) => {
    if (!error) return false;
    const message = error.message || '';
    const code = error.code || '';
    return code === 'permission-denied' || message.includes('permission-denied') || message.includes('Missing or insufficient permissions');
};

const FinalPermissionsChecklist: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
    const projectId = firebaseConfig.projectId;
    const firestoreRulesUrl = `https://console.firebase.google.com/project/${projectId}/firestore/rules`;
    const storageRulesUrl = `https://console.firebase.google.com/project/${projectId}/storage/rules`;

    const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allow read and write access to everyone for the demo.
      allow read, write: if true;
    }
  }
}`;

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
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border-t-4 border-yellow-500">
            <div className="text-center mb-6">
                 <i className="fas fa-tasks text-4xl text-yellow-500 mb-3"></i>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Final Permissions Checklist</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Excellent! We've reached the final setup step. The app is connected, but Firebase's security rules are blocking it. Please complete this checklist.
                </p>
            </div>

            <div className="space-y-4">
                {/* Step 1: Confirm Project ID */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white"><span className="bg-yellow-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">1</span>Confirm Your Project ID</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Ensure the project you are editing in the Firebase Console matches this ID. A mismatch is the #1 cause of this error.
                    </p>
                    <div className="mt-2 bg-white dark:bg-gray-800 p-2 rounded text-center">
                        <code className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-lg">{projectId}</code>
                    </div>
                </div>

                {/* Step 2: Firestore Rules */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white"><span className="bg-yellow-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">2</span>Fix Database Rules</h2>
                    <a href={firestoreRulesUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">A. Open Database Rules Editor</a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">B. Delete everything in the text box, then copy & paste the code below.</p>
                    <div className="relative mt-2">
                        <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded-md overflow-x-auto"><code>{firestoreRules}</code></pre>
                        <button onClick={() => copyToClipboard(firestoreRules)} className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">C. Click the blue <strong className="text-gray-800 dark:text-gray-200">Publish</strong> button.</p>
                </div>

                {/* Step 3: Storage Rules */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white"><span className="bg-yellow-500 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">3</span>Fix File Storage Rules</h2>
                    <a href={storageRulesUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">A. Open Storage Rules Editor</a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">B. Delete everything, then copy & paste the code below.</p>
                    <div className="relative mt-2">
                        <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded-md overflow-x-auto"><code>{storageRules}</code></pre>
                        <button onClick={() => copyToClipboard(storageRules)} className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">Copy</button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">C. Click the blue <strong className="text-gray-800 dark:text-gray-200">Publish</strong> button.</p>
                </div>
            </div>

             <div className="mt-8 text-center">
                <button onClick={onRetry} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-lg">
                    <i className="fas fa-redo-alt mr-2"></i>
                    Retry Connection
                </button>
            </div>
        </div>
    );
};


const GenericErrorScreen: React.FC<{ error: any, onRetry: () => void }> = ({ error, onRetry }) => {
    // Fallback screen for any other type of error
     return (
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border-t-4 border-red-500">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Firebase Connection Error</h1>
            <p className="text-gray-600 dark:text-gray-300 my-4">
                An unexpected error occurred while trying to connect to Firebase.
            </p>
            <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md">
                <p className="font-bold">Error Details:</p>
                <p className="text-sm">{error?.message || 'No error message available.'}</p>
                {error?.code && <p className="text-xs mt-1">Code: {error.code}</p>}
            </div>
            <div className="mt-8 text-center">
                <button onClick={onRetry} className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">
                    Retry Connection
                </button>
            </div>
        </div>
    );
}

const FirebaseServiceErrorScreen: React.FC<FirebaseServiceErrorScreenProps> = ({ error, onRetry }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
            {isPermissionError(error) ? (
                <FinalPermissionsChecklist onRetry={onRetry} />
            ) : (
                <GenericErrorScreen error={error} onRetry={onRetry} />
            )}
        </div>
    );
};

export default FirebaseServiceErrorScreen;