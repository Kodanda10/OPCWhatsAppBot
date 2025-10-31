import React from 'react';
import { firebaseConfig } from '../firebaseConfig';

const FirebaseConfigErrorScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 border-t-4 border-red-500">
                <div className="flex items-center mb-4">
                    <i className="fas fa-cogs text-3xl text-red-500 mr-4"></i>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Firebase Not Configured</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Welcome! To use this application, you need to connect it to your own Firebase project. This is a one-time setup.
                </p>

                <div className="space-y-4 text-gray-700 dark:text-gray-200">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <div className="ml-4">
                            <h2 className="font-semibold">Create a Firebase Project</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Firebase Console</a> and create a new project (or use an existing one).</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <div className="ml-4">
                            <h2 className="font-semibold">Add a Web App</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">In your project's settings, add a new Web App. Firebase will provide you with a configuration object.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <div className="ml-4">
                            <h2 className="font-semibold">Copy and Paste Your Config</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Copy the entire `firebaseConfig` object and paste it into the <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded text-xs">firebaseConfig.ts</code> file in this project, replacing the placeholder values.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">The contents of your <code className="text-xs">firebaseConfig.ts</code> file should look like this:</p>
                    <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                        <code>
{`export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..." // optional
};`}
                        </code>
                    </pre>
                </div>
                 <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                    After updating the file, please reload this page.
                </p>
            </div>
        </div>
    );
};

export default FirebaseConfigErrorScreen;
