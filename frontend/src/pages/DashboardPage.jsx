    import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { useAuth } from '../context/AuthContext';
    import { useSignal } from '../context/SignalContext';
    import { FaSignOutAlt, FaTachometerAlt, FaHistory, FaCog } from 'react-icons/fa';
    import Dashboard from '../components/dashboard/Dashboard';
    import HistoryTable from '../components/dashboard/HistoryTable';
    import SettingsPanel from '../components/dashboard/SettingsPanel';
    import ControlPanel from '../components/dashboard/ControlPanel';
    import AnalyticsCards from '../components/dashboard/AnalyticsCards';

    const DashboardPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { logout } = useAuth();
    const { signalState } = useSignal();

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
        { id: 'history', label: 'History', icon: FaHistory },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    return (
        <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="glass border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Traffic Control
                </h1>
                <div className="hidden md:flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded ${
                    signalState?.status === 'running' ? 'bg-green-500/20 text-green-400' :
                    signalState?.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                }`}>
                    {(signalState?.status || '').toUpperCase()}
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                    {(signalState?.mode || '').toUpperCase()}
                </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                >
                <FaSignOutAlt />
                <span className="hidden md:inline">Logout</span>
                </button>
            </div>
            </div>
        </header>

        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 mt-6">
            <div className="flex gap-2 border-b border-white/10">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                >
                <tab.icon />
                {tab.label}
                {activeTab === tab.id && (
                    <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"
                    />
                )}
                </button>
            ))}
            </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
            {activeTab === 'dashboard' && (
            <div className="space-y-6">
                <AnalyticsCards />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ControlPanel />
                <Dashboard />
                </div>
            </div>
            )}
            {activeTab === 'history' && <HistoryTable />}
            {activeTab === 'settings' && <SettingsPanel />}
        </div>
        </div>
    );
    };

    export default DashboardPage;