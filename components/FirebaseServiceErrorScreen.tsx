import React from 'react';
import { firebaseConfig } from '../firebaseConfig';

interface FirebaseServiceErrorScreenProps {
    error: any;
    onRetry: () => void;
}

const ChecklistItem: React.FC<{ number: number; title: string; children: React.ReactNode; }> = ({ number, title, children }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{number}</div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">{title}</h3>
            <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm">{children}</div>
        </div>
    </div>
);

const FirebaseServiceErrorScreen: React.FC<FirebaseServiceErrorScreenProps> = ({ error, onRetry }) => {
    // This screen is now dedicated to solving the permission-denied error, as it's the most common final step.
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border-t-4 border-green-500">
                <div className="flex items-center mb-4">
                    <i className="fas fa-check-circle text-3xl text-green-500 mr-4"></i>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Almost There! Let's Set Your Permissions.</h1>
                </div>
                 <p className="text-gray-600 dark:text-gray-300 mb-6">
                    The app is connecting to Firebase, but it's being blocked by the default security rules. This is the final step. Please follow this checklist carefully.
                </p>

                <div className="space-y-6">
                    <ChecklistItem number={1} title="Confirm Your Project ID">
                        <p>This is the most common reason for errors. Please ensure the Project ID in the Firebase Console <strong className="text-red-500">exactly matches</strong> the one below.</p>
                        <p className="font-mono text-center my-2 p-2 bg-gray-200 dark:bg-gray-900 rounded-md text-blue-600 dark:text-blue-400 font-bold">{firebaseConfig.projectId}</p>
                    </ChecklistItem>
                    
                    <ChecklistItem number={2} title="Update Database (Firestore) Rules">
                        <p>
                            Click the button below, replace the entire editor content with the provided code, and click <strong className="font-bold text-yellow-500">Publish</strong>.
                        </p>
                        <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/rules`} target="_blank" rel="noopener noreferrer" className="inline-block my-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md text-xs font-bold">
                            <i className="fas fa-database mr-2"></i>Open Database Rules
                        </a>
                        <pre className="mt-2 text-xs bg-gray-200 dark:bg-gray-900 p-3 rounded-md overflow-x-auto border dark:border-gray-700">
                            <code>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Allows read/write access for this demo.
      allow read, write: if true;
    }
  }
}`}
                            </code>
                        </pre>
                    </ChecklistItem>

                    <ChecklistItem number={3} title="Update Storage Rules">
                         <p>
                            Click the button below, replace the entire editor content with the provided code, and click <strong className="font-bold text-yellow-500">Publish</strong>.
                        </p>
                        <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/storage/rules`} target="_blank" rel="noopener noreferrer" className="inline-block my-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-md text-xs font-bold">
                            <i className="fas fa-folder-open mr-2"></i>Open Storage Rules
                        </a>
                        <pre className="mt-2 text-xs bg-gray-200 dark:bg-gray-900 p-3 rounded-md overflow-x-auto border dark:border-gray-700">
                            <code>
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allows read/write access for this demo.
      allow read, write: if true;
    }
  }
}`}
                            </code>
                        </pre>
                    </ChecklistItem>

                    <ChecklistItem number={4} title="Retry Connection">
                        <p>Once you have completed all the steps above, click the button below to connect.</p>
                        <button
                            onClick={onRetry}
                            className="mt-2 bg-[#00A884] text-white font-bold px-8 py-3 rounded-md hover:bg-[#008a6b] transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A884] dark:focus:ring-offset-gray-800"
                        >
                            <i className="fas fa-sync-alt mr-2"></i>
                            Retry Connection
                        </button>
                    </ChecklistItem>
                </div>
            </div>
        </div>
    );
};

export default FirebaseServiceErrorScreen;
