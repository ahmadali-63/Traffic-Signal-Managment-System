    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { useSignal } from '../../context/SignalContext';
    import SignalLight from './SignalLight';
    import CountdownTimer from './CountdownTimer';
    import StatusDisplay from './StatusDisplay';

    const TrafficSignal = () => {
    const { signalState } = useSignal();
    const [time, setTime] = useState(signalState.remainingTime || 0);

    useEffect(() => {
        setTime(signalState.remainingTime || 0);
    }, [signalState.remainingTime]);

    const getStatusText = () => {
        switch (signalState.currentLight) {
        case 'red': return 'STOP';
        case 'yellow': return 'READY';
        case 'green': return 'GO';
        default: return '';
        }
    };

    const getStatusColor = () => {
        switch (signalState.currentLight) {
        case 'red': return 'text-red-500';
        case 'yellow': return 'text-yellow-500';
        case 'green': return 'text-green-500';
        default: return '';
        }
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
        >
        <div className="glass p-8 max-w-md mx-auto">
            {/* Signal Pole */}
            <div className="flex flex-col items-center space-y-6">
            {/* Signal Lights */}
            <div className="relative">
                <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-800">
                <div className="space-y-6">
                    <SignalLight color="red" isActive={signalState.currentLight === 'red'} />
                    <SignalLight color="yellow" isActive={signalState.currentLight === 'yellow'} />
                    <SignalLight color="green" isActive={signalState.currentLight === 'green'} />
                </div>
                </div>
                
                {/* Glow Effect */}
                {signalState.status === 'running' && (
                <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-30 ${
                    signalState.currentLight === 'red' ? 'bg-red-500' :
                    signalState.currentLight === 'yellow' ? 'bg-yellow-500' :
                    'bg-green-500'
                }`} />
                )}
            </div>

            {/* Countdown Timer */}
            <CountdownTimer time={time} />
            </div>

            {/* Status Display */}
            <div className="mt-6 text-center">
            <StatusDisplay />
            
            <motion.div
                key={signalState.currentLight}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-4xl font-bold mt-2 ${getStatusColor()}`}
            >
                {getStatusText()}
            </motion.div>

            {/* Mode and Status */}
            <div className="flex justify-center gap-4 mt-4 text-sm">
                <span className="px-3 py-1 bg-slate-800/50 rounded-full">
                Mode: <span className="font-semibold">{(signalState?.mode || '').toUpperCase()}</span>
                </span>
                <span className="px-3 py-1 bg-slate-800/50 rounded-full">
                Status: <span className={`font-semibold ${
                    signalState?.status === 'running' ? 'text-green-400' :
                    signalState?.status === 'paused' ? 'text-yellow-400' :
                    'text-red-400'
                }`}>
                    {(signalState?.status || '').toUpperCase()}
                </span>
                </span>
                <span className="px-3 py-1 bg-slate-800/50 rounded-full">
                Cycles: <span className="font-semibold">{signalState?.totalCycles || 0}</span>
                </span>
            </div>
            </div>
        </div>
        </motion.div>
    );
    };

    export default TrafficSignal;