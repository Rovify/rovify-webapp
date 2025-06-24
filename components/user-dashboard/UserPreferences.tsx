/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import {
    FiBell, FiShield, FiSettings, FiUser, FiSave, FiCheck, FiMoon, FiSun, FiGlobe,
    FiMusic, FiMapPin, FiWifi, FiDollarSign, FiTrendingUp, FiZap, FiHeart,
    FiStar, FiCalendar, FiCamera, FiHeadphones, FiVolumeX
} from 'react-icons/fi';

interface NotificationPreferences {
    email: boolean;
    push: boolean;
    sms: boolean;
    eventReminders: boolean;
    friendActivity: boolean;
    promotions: boolean;
    weeklyDigest: boolean;
    securityAlerts: boolean;
}

interface PrivacyPreferences {
    profileVisibility: string;
    allowMessages: string;
    showLocation: boolean;
    showEvents: boolean;
    dataSharing: boolean;
    analytics: boolean;
}

interface DisplayPreferences {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    compactMode: boolean;
}

interface AccountPreferences {
    twoFactorAuth: boolean;
    sessionTimeout: string;
    downloadData: boolean;
    deleteAccount: boolean;
}

interface BlockchainPreferences {
    walletConnected: boolean;
    preferredWallet: string;
    gasAlerts: boolean;
    nftDisplay: boolean;
    defiNotifications: boolean;
    cryptoPayments: boolean;
    tokenUpdates: boolean;
    stakingAlerts: boolean;
    basechainEnabled: boolean;
    smartContracts: boolean;
}

interface PartyPreferences {
    partyDiscovery: boolean;
    musicGenre: string;
    partySize: string;
    vibePreference: string;
    autoCheckin: boolean;
    partyNotifications: boolean;
    friendInvites: boolean;
    eventRecommendations: boolean;
    liveStreaming: boolean;
    partyMode: boolean;
}

interface UserPreferences {
    notifications: NotificationPreferences;
    privacy: PrivacyPreferences;
    display: DisplayPreferences;
    account: AccountPreferences;
    blockchain: BlockchainPreferences;
    party: PartyPreferences;
}

export default function PreferencesPage() {
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        notifications: {
            email: true,
            push: true,
            sms: false,
            eventReminders: true,
            friendActivity: true,
            promotions: false,
            weeklyDigest: true,
            securityAlerts: true
        },
        privacy: {
            profileVisibility: 'friends',
            allowMessages: 'friends',
            showLocation: false,
            showEvents: true,
            dataSharing: false,
            analytics: true
        },
        display: {
            theme: 'auto',
            language: 'en',
            timezone: 'PST',
            dateFormat: 'MM/DD/YYYY',
            currency: 'USD',
            compactMode: false
        },
        account: {
            twoFactorAuth: false,
            sessionTimeout: '30',
            downloadData: false,
            deleteAccount: false
        },
        blockchain: {
            walletConnected: false,
            preferredWallet: 'metamask',
            gasAlerts: true,
            nftDisplay: true,
            defiNotifications: false,
            cryptoPayments: true,
            tokenUpdates: true,
            stakingAlerts: false,
            basechainEnabled: true,
            smartContracts: false
        },
        party: {
            partyDiscovery: true,
            musicGenre: 'electronic',
            partySize: 'medium',
            vibePreference: 'energetic',
            autoCheckin: false,
            partyNotifications: true,
            friendInvites: true,
            eventRecommendations: true,
            liveStreaming: false,
            partyMode: true
        }
    });

    const [savedState, setSavedState] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>('party');

    const handlePreferenceChange = (
        section: keyof UserPreferences,
        key: string,
        value: string | boolean
    ) => {
        setUserPreferences(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
        setSavedState(false);
    };

    const handleSavePreferences = () => {
        setSavedState(true);
        setTimeout(() => setSavedState(false), 3000);
    };

    interface ToggleSwitchProps {
        value: boolean;
        onChange: () => void;
        color?: 'orange' | 'green' | 'blue' | 'purple' | 'neon' | 'gold' | 'pink';
        size?: 'sm' | 'md' | 'lg';
    }

    const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange, color = "orange", size = "md" }) => {
        const sizeClasses = {
            sm: { container: 'w-10 h-5', toggle: 'w-3 h-3', translate: 'translate-x-5' },
            md: { container: 'w-12 h-6', toggle: 'w-4 h-4', translate: 'translate-x-6' },
            lg: { container: 'w-14 h-7', toggle: 'w-5 h-5', translate: 'translate-x-7' }
        };

        const colorClasses = {
            orange: value ? 'bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-400/50' : 'bg-gray-300',
            green: value ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-green-400/50' : 'bg-gray-300',
            blue: value ? 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-400/50' : 'bg-gray-300',
            purple: value ? 'bg-gradient-to-r from-purple-400 to-purple-600 shadow-purple-400/50' : 'bg-gray-300',
            neon: value ? 'bg-gradient-to-r from-cyan-400 to-emerald-500 shadow-cyan-400/50' : 'bg-gray-300',
            gold: value ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-400/50' : 'bg-gray-300',
            pink: value ? 'bg-gradient-to-r from-pink-400 to-rose-500 shadow-pink-400/50' : 'bg-gray-300'
        };

        const { container, toggle, translate } = sizeClasses[size];

        return (
            <button
                onClick={onChange}
                className={`relative ${container} rounded-full transition-all duration-300 ${colorClasses[color]} ${value ? 'shadow-lg' : ''} hover:scale-105`}
            >
                <div
                    className={`absolute top-0.5 ${toggle} bg-white rounded-full shadow-md transition-transform duration-300 ${value ? translate : 'translate-x-0.5'
                        }`}
                />
            </button>
        );
    };

    interface SectionButtonProps {
        id: string;
        icon: React.ComponentType<{ className?: string }>;
        title: string;
        isActive: boolean;
        onClick: (id: string) => void;
        gradient?: string;
    }

    const SectionButton: React.FC<SectionButtonProps> = ({ id, icon: Icon, title, isActive, onClick, gradient }) => (
        <button
            onClick={() => onClick(id)}
            className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                ? `bg-gradient-to-r ${gradient || 'from-indigo-500 to-purple-600'} text-white shadow-lg scale-105`
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-gray-100/50 hover:shadow-md'
                }`}
        >
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
            )}
            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-gray-500 group-hover:scale-105'}`} />
            <span className="font-semibold relative z-10">{title}</span>
        </button>
    );

    const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
        <div className={`bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl ${className}`}>
            {children}
        </div>
    );

    const renderParty = () => (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl">
                        <FiMusic className="w-6 h-6 text-white" />
                    </div>
                    Party & Social Vibes 🎉
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
                        <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FiHeadphones className="w-4 h-4 text-pink-500" />
                            Music Genre
                        </label>
                        <select
                            value={userPreferences.party.musicGenre}
                            onChange={(e) => handlePreferenceChange('party', 'musicGenre', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all"
                        >
                            <option value="electronic">Electronic/EDM</option>
                            <option value="hiphop">Hip Hop</option>
                            <option value="house">House</option>
                            <option value="techno">Techno</option>
                            <option value="reggaeton">Reggaeton</option>
                            <option value="pop">Pop</option>
                        </select>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-100">
                        <label className="block font-semibold text-gray-900 mb-3">Party Size Preference</label>
                        <select
                            value={userPreferences.party.partySize}
                            onChange={(e) => handlePreferenceChange('party', 'partySize', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                        >
                            <option value="intimate">Intimate (10-30)</option>
                            <option value="medium">Medium (30-100)</option>
                            <option value="large">Large (100-500)</option>
                            <option value="massive">Massive (500+)</option>
                        </select>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                        <label className="block font-semibold text-gray-900 mb-3">Vibe Preference</label>
                        <select
                            value={userPreferences.party.vibePreference}
                            onChange={(e) => handlePreferenceChange('party', 'vibePreference', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        >
                            <option value="chill">Chill & Relaxed</option>
                            <option value="energetic">High Energy</option>
                            <option value="underground">Underground</option>
                            <option value="mainstream">Mainstream</option>
                            <option value="exclusive">Exclusive/VIP</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.entries({
                        partyDiscovery: 'Smart Party Discovery',
                        autoCheckin: 'Auto Check-in to Events',
                        partyNotifications: 'Party Starting Soon Alerts',
                        friendInvites: 'Friend Party Invitations',
                        eventRecommendations: 'AI Event Recommendations',
                        liveStreaming: 'Live Stream Party Moments',
                        partyMode: 'Party Mode (Enhanced Features)'
                    }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur rounded-2xl border border-white/30 hover:from-white/80 hover:to-white/60 transition-all">
                            <div>
                                <h4 className="font-semibold text-gray-900">{label}</h4>
                                <p className="text-sm text-gray-600">
                                    {key === 'partyDiscovery' && 'Find parties based on your music taste and location'}
                                    {key === 'autoCheckin' && 'Automatically check into events you attend'}
                                    {key === 'partyNotifications' && 'Get notified when parties are starting'}
                                    {key === 'friendInvites' && 'Receive invitations from friends'}
                                    {key === 'eventRecommendations' && 'AI-powered event suggestions'}
                                    {key === 'liveStreaming' && 'Share live moments from parties'}
                                    {key === 'partyMode' && 'Enable enhanced party features and UI'}
                                </p>
                            </div>
                            <ToggleSwitch
                                value={userPreferences.party[key as keyof PartyPreferences] as boolean}
                                onChange={() => handlePreferenceChange('party', key, !userPreferences.party[key as keyof PartyPreferences])}
                                color="pink"
                                size="lg"
                            />
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );

    const renderBlockchain = () => (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-emerald-600 rounded-xl">
                        <FiZap className="w-6 h-6 text-white" />
                    </div>
                    Blockchain & Crypto ⚡
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl border border-cyan-100">
                        <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FiWifi className="w-4 h-4 text-cyan-500" />
                            Preferred Wallet
                        </label>
                        <select
                            value={userPreferences.blockchain.preferredWallet}
                            onChange={(e) => handlePreferenceChange('blockchain', 'preferredWallet', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                        >
                            <option value="metamask">MetaMask</option>
                            <option value="coinbase">Coinbase Wallet</option>
                            <option value="trust">Trust Wallet</option>
                            <option value="phantom">Phantom</option>
                            <option value="rainbow">Rainbow</option>
                        </select>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <FiTrendingUp className="w-4 h-4 text-emerald-500" />
                                    Base Chain Enabled
                                </h4>
                                <p className="text-sm text-gray-600">Use Coinbase&apos;s Base network</p>
                            </div>
                            <ToggleSwitch
                                value={userPreferences.blockchain.basechainEnabled}
                                onChange={() => handlePreferenceChange('blockchain', 'basechainEnabled', !userPreferences.blockchain.basechainEnabled)}
                                color="neon"
                                size="lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.entries({
                        walletConnected: 'Wallet Connected',
                        gasAlerts: 'Gas Fee Alerts',
                        nftDisplay: 'Show NFTs in Profile',
                        defiNotifications: 'DeFi Protocol Updates',
                        cryptoPayments: 'Enable Crypto Payments',
                        tokenUpdates: 'Token Price Alerts',
                        stakingAlerts: 'Staking Rewards Notifications',
                        smartContracts: 'Smart Contract Interactions'
                    }).map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur rounded-2xl border border-white/30 hover:from-white/80 hover:to-white/60 transition-all">
                            <div>
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    {key === 'walletConnected' && <FiWifi className="w-4 h-4 text-cyan-500" />}
                                    {key === 'gasAlerts' && <FiZap className="w-4 h-4 text-yellow-500" />}
                                    {key === 'nftDisplay' && <FiStar className="w-4 h-4 text-purple-500" />}
                                    {key === 'cryptoPayments' && <FiDollarSign className="w-4 h-4 text-green-500" />}
                                    {key === 'tokenUpdates' && <FiTrendingUp className="w-4 h-4 text-blue-500" />}
                                    {label}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {key === 'walletConnected' && 'Connect your crypto wallet to the app'}
                                    {key === 'gasAlerts' && 'Get notified about optimal gas fees'}
                                    {key === 'nftDisplay' && 'Display your NFT collection on your profile'}
                                    {key === 'defiNotifications' && 'Updates from DeFi protocols you use'}
                                    {key === 'cryptoPayments' && 'Pay for events and services with crypto'}
                                    {key === 'tokenUpdates' && 'Price alerts for your favorite tokens'}
                                    {key === 'stakingAlerts' && 'Notifications about staking rewards'}
                                    {key === 'smartContracts' && 'Enable smart contract interactions'}
                                </p>
                            </div>
                            <ToggleSwitch
                                value={userPreferences.blockchain[key as keyof BlockchainPreferences] as boolean}
                                onChange={() => handlePreferenceChange('blockchain', key, !userPreferences.blockchain[key as keyof BlockchainPreferences])}
                                color="neon"
                                size="lg"
                            />
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );

    const renderNotifications = () => (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
                        <FiBell className="w-6 h-6 text-white" />
                    </div>
                    Notification Hub 📢
                </h3>
                <div className="space-y-4">
                    {Object.entries(userPreferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur rounded-2xl border border-white/30 hover:from-white/80 hover:to-white/60 transition-all">
                            <div>
                                <h4 className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-sm text-gray-600">
                                    {key === 'email' && 'Receive notifications via email'}
                                    {key === 'push' && 'Browser push notifications'}
                                    {key === 'sms' && 'Text message notifications'}
                                    {key === 'eventReminders' && 'Reminders about upcoming events'}
                                    {key === 'friendActivity' && 'Updates about friend activities'}
                                    {key === 'promotions' && 'Special offers and promotions'}
                                    {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                                    {key === 'securityAlerts' && 'Important security notifications'}
                                </p>
                            </div>
                            <ToggleSwitch
                                value={value}
                                onChange={() => handlePreferenceChange('notifications', key, !value)}
                                color="orange"
                                size="lg"
                            />
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );

    const renderPrivacy = () => (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                        <FiShield className="w-6 h-6 text-white" />
                    </div>
                    Privacy & Security 🔒
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                            <label className="block font-semibold text-gray-900 mb-3">Profile Visibility</label>
                            <select
                                value={userPreferences.privacy.profileVisibility}
                                onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                                className="w-full p-3 bg-white/80 backdrop-blur border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all"
                            >
                                <option value="public">Public</option>
                                <option value="friends">Friends Only</option>
                                <option value="private">Private</option>
                            </select>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                            <label className="block font-semibold text-gray-900 mb-3">Who can message you</label>
                            <select
                                value={userPreferences.privacy.allowMessages}
                                onChange={(e) => handlePreferenceChange('privacy', 'allowMessages', e.target.value)}
                                className="w-full p-3 bg-white/80 backdrop-blur border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                            >
                                <option value="everyone">Everyone</option>
                                <option value="friends">Friends Only</option>
                                <option value="none">No One</option>
                            </select>
                        </div>
                    </div>

                    {['showLocation', 'showEvents', 'dataSharing', 'analytics'].map((key) => (
                        <div key={key} className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur rounded-2xl border border-white/30 hover:from-white/80 hover:to-white/60 transition-all">
                            <div>
                                <h4 className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <p className="text-sm text-gray-600">
                                    {key === 'showLocation' && 'Display your location on your profile'}
                                    {key === 'showEvents' && 'Show your event attendance publicly'}
                                    {key === 'dataSharing' && 'Share anonymized data for product improvement'}
                                    {key === 'analytics' && 'Allow usage analytics for better experience'}
                                </p>
                            </div>
                            <ToggleSwitch
                                value={userPreferences.privacy[key as keyof PrivacyPreferences] as boolean}
                                onChange={() => handlePreferenceChange('privacy', key, !userPreferences.privacy[key as keyof PrivacyPreferences])}
                                color="green"
                                size="lg"
                            />
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );

    const renderDisplay = () => (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <FiSettings className="w-6 h-6 text-white" />
                    </div>
                    Display & Language 🎨
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FiMoon className="w-4 h-4" />
                            Theme
                        </label>
                        <select
                            value={userPreferences.display.theme}
                            onChange={(e) => handlePreferenceChange('display', 'theme', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                            <option value="neon">Neon Party</option>
                        </select>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                        <label className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FiGlobe className="w-4 h-4" />
                            Language
                        </label>
                        <select
                            value={userPreferences.display.language}
                            onChange={(e) => handlePreferenceChange('display', 'language', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                        </select>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                        <label className="block font-semibold text-gray-900 mb-3">Currency</label>
                        <select
                            value={userPreferences.display.currency}
                            onChange={(e) => handlePreferenceChange('display', 'currency', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="ETH">ETH (Ξ)</option>
                            <option value="BTC">BTC (₿)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur rounded-2xl border border-white/30 hover:from-white/80 hover:to-white/60 transition-all">
                    <div>
                        <h4 className="font-semibold text-gray-900">Compact Mode</h4>
                        <p className="text-sm text-gray-600">Use a more condensed interface layout</p>
                    </div>
                    <ToggleSwitch
                        value={userPreferences.display.compactMode}
                        onChange={() => handlePreferenceChange('display', 'compactMode', !userPreferences.display.compactMode)}
                        color="blue"
                        size="lg"
                    />
                </div>
            </GlassCard>
        </div>
    );

    const renderAccount = () => (
        <div className="space-y-6">
            <GlassCard className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                        <FiUser className="w-6 h-6 text-white" />
                    </div>
                    Account Settings ⚙️
                </h3>
                <div className="space-y-6">
                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                        <label className="block font-semibold text-gray-900 mb-3">Session Timeout</label>
                        <select
                            value={userPreferences.account.sessionTimeout}
                            onChange={(e) => handlePreferenceChange('account', 'sessionTimeout', e.target.value)}
                            className="w-full p-3 bg-white/80 backdrop-blur border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                        >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="never">Never</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur rounded-2xl border border-white/30 hover:from-white/80 hover:to-white/60 transition-all">
                        <div>
                            <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <ToggleSwitch
                            value={userPreferences.account.twoFactorAuth}
                            onChange={() => handlePreferenceChange('account', 'twoFactorAuth', !userPreferences.account.twoFactorAuth)}
                            color="purple"
                            size="lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl text-blue-700 hover:from-blue-100 hover:to-cyan-100 transition-all transform hover:scale-105">
                            <div className="font-semibold flex items-center gap-2">
                                <FiSave className="w-4 h-4" />
                                Download Your Data
                            </div>
                            <div className="text-sm text-blue-600">Get a copy of your account data</div>
                        </button>
                        <button className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl text-red-700 hover:from-red-100 hover:to-pink-100 transition-all transform hover:scale-105">
                            <div className="font-semibold">Delete Account</div>
                            <div className="text-sm text-red-600">Permanently delete your account</div>
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'party': return renderParty();
            case 'blockchain': return renderBlockchain();
            case 'notifications': return renderNotifications();
            case 'privacy': return renderPrivacy();
            case 'display': return renderDisplay();
            case 'account': return renderAccount();
            default: return renderParty();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Futuristic Header */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 rounded-3xl p-8 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                            Rovify Preferences
                        </h1>
                        <p className="text-indigo-100 text-xl font-medium">
                            🎉 Customize your party & crypto experience
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Modern Sidebar */}
                    <div className="lg:w-72 space-y-3">
                        <SectionButton
                            id="party"
                            icon={FiMusic}
                            title="Party Vibes"
                            isActive={activeSection === 'party'}
                            onClick={setActiveSection}
                            gradient="from-pink-500 to-purple-600"
                        />
                        <SectionButton
                            id="blockchain"
                            icon={FiZap}
                            title="Blockchain & Crypto"
                            isActive={activeSection === 'blockchain'}
                            onClick={setActiveSection}
                            gradient="from-cyan-500 to-emerald-600"
                        />
                        <SectionButton
                            id="notifications"
                            icon={FiBell}
                            title="Notifications"
                            isActive={activeSection === 'notifications'}
                            onClick={setActiveSection}
                            gradient="from-orange-500 to-red-600"
                        />
                        <SectionButton
                            id="privacy"
                            icon={FiShield}
                            title="Privacy & Security"
                            isActive={activeSection === 'privacy'}
                            onClick={setActiveSection}
                            gradient="from-green-500 to-emerald-600"
                        />
                        <SectionButton
                            id="display"
                            icon={FiSettings}
                            title="Display & Language"
                            isActive={activeSection === 'display'}
                            onClick={setActiveSection}
                            gradient="from-blue-500 to-indigo-600"
                        />
                        <SectionButton
                            id="account"
                            icon={FiUser}
                            title="Account Settings"
                            isActive={activeSection === 'account'}
                            onClick={setActiveSection}
                            gradient="from-purple-500 to-pink-600"
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {renderContent()}
                    </div>
                </div>

                {/* Futuristic Save Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSavePreferences}
                        className={`relative overflow-hidden flex items-center gap-4 px-12 py-5 rounded-2xl font-bold text-white transition-all duration-500 transform hover:scale-105 ${savedState
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30'
                            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-indigo-500/30'
                            } shadow-2xl`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        {savedState ? (
                            <>
                                <FiCheck className="w-6 h-6 relative z-10" />
                                <span className="text-xl relative z-10">Preferences Saved! ✨</span>
                            </>
                        ) : (
                            <>
                                <FiSave className="w-6 h-6 relative z-10" />
                                <span className="text-xl relative z-10">Save Preferences</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}