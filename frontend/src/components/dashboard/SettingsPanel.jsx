    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useSignal } from '../../context/SignalContext';
    import api from '../../services/api';
    import toast from 'react-hot-toast';
    import { FaSave, FaUndo } from 'react-icons/fa';

    const SettingsPanel = () => {
    const { updateSettings } = useSignal();
    const [settings, setSettings] = useState({
        redDuration: 5,
        yellowDuration: 5,
        greenDuration: 20,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
        const response = await api.get('/settings');
        setSettings(response.data);
        } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
        } finally {
        setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
        await updateSettings(settings);
        toast.success('Settings updated successfully');
        } catch (error) {
        toast.error('Failed to update settings');
        } finally {
        setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings({
        redDuration: 5,
        yellowDuration: 5,
        greenDuration: 20,
        });
    };

    if (loading) {
        return (
        <div className="glass p-6">
            <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-800/60 rounded w-1/3" />
            <div className="h-12 bg-slate-800/60 rounded" />
            <div className="h-12 bg-slate-800/60 rounded" />
            <div className="h-12 bg-slate-800/60 rounded" />
            </div>
        </div>
        );
    }

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
        >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaSave className="text-blue-400" />
            Signal Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Red Light Duration (seconds)
            </label>
            <div className="flex items-center gap-4">
                <input
                type="range"
                min="1"
                max="60"
                value={settings.redDuration}
                onChange={(e) => setSettings({ ...settings, redDuration: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-slate-700/30 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-red-400 w-12 text-center">
                {settings.redDuration}s
                </span>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Yellow Light Duration (seconds)
            </label>
            <div className="flex items-center gap-4">
                <input
                type="range"
                min="1"
                max="10"
                value={settings.yellowDuration}
                onChange={(e) => setSettings({ ...settings, yellowDuration: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-slate-700/30 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-yellow-400 w-12 text-center">
                {settings.yellowDuration}s
                </span>
            </div>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Green Light Duration (seconds)
            </label>
            <div className="flex items-center gap-4">
                <input
                type="range"
                min="1"
                max="120"
                value={settings.greenDuration}
                onChange={(e) => setSettings({ ...settings, greenDuration: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-slate-700/30 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-2xl font-bold text-green-400 w-12 text-center">
                {settings.greenDuration}s
                </span>
            </div>
            </div>

            <div className="flex gap-4">
            <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                <>
                    <FaSave />
                    Save Settings
                </>
                )}
            </button>
            <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-slate-800/40 hover:bg-slate-800/50 rounded-lg text-gray-400 transition-colors flex items-center gap-2"
            >
                <FaUndo />
                Reset
            </button>
            </div>
        </form>
        </motion.div>
    );
    };

    export default SettingsPanel;