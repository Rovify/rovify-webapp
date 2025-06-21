'use client';

import { FiUser, FiLock, FiLink, FiAlertCircle } from 'react-icons/fi';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                <p className="text-gray-300">Manage your account and security settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiUser className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Account Info</h3>
                    <p className="text-gray-600 text-sm">Update your personal information</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiLock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Security</h3>
                    <p className="text-gray-600 text-sm">Password and security settings</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                    <FiLink className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Connected Apps</h3>
                    <p className="text-gray-600 text-sm">Manage connected applications</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-red-200 text-center">
                    <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                    <p className="text-gray-600 text-sm">Delete account and export data</p>
                </div>
            </div>
        </div>
    );
}