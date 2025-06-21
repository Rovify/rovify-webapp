'use client';

import { FiBell, FiShield, FiSettings } from 'react-icons/fi';

export default function PreferencesPage() {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Preferences</h1>
                <p className="text-indigo-100">Customize your Rovify experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiBell className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Notifications</h3>
                    <p className="text-gray-600 text-sm">Manage your notification settings</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiShield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Privacy</h3>
                    <p className="text-gray-600 text-sm">Control your privacy settings</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiSettings className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Display</h3>
                    <p className="text-gray-600 text-sm">Customize your display preferences</p>
                </div>
            </div>
        </div>
    );
}