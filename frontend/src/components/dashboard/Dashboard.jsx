    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useSignal } from '../../context/SignalContext';
    import TrafficSignal from '../traffic/TrafficSignal';
    import { FaWifi } from 'react-icons/fa';

    const Dashboard = () => {
    const { connected, signalState } = useSignal();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
        >
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
            <span>Live View</span>
            {connected ? (
                <FaWifi className="text-green-400 text-sm animate-pulse" />
            ) : (
                <FaWifi className="text-red-400 text-sm opacity-40" />
            )}
            </h2>
            <div className="text-sm text-gray-400">
            {time.toLocaleTimeString()}
            </div>
        </div>

        <div className="flex justify-center">
            <TrafficSignal />
        </div>

        <div className="mt-4 p-3 bg-slate-800/60 rounded-lg text-sm">
            <div className="flex items-center justify-between">
            <span className="text-gray-400">Total Cycles:</span>
            <span className="font-semibold">{signalState?.totalCycles ?? 0}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
            <span className="text-gray-400">Last Updated:</span>
            <span className="font-mono text-xs text-gray-400">
                {new Date().toLocaleTimeString()}
            </span>
            </div>
        </div>
        </motion.div>
    );
    };

    export default Dashboard;