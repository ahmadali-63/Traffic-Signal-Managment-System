    import React from 'react';
    import { motion } from 'framer-motion';
    import { useSignal } from '../../context/SignalContext';
    import { FaCircle } from 'react-icons/fa';

    const StatusDisplay = () => {
    const { signalState } = useSignal();

    const getStatusIcon = () => {
        switch (signalState.currentLight) {
        case 'red': return '🔴';
        case 'yellow': return '🟡';
        case 'green': return '🟢';
        default: return '';
        }
    };

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 text-sm"
        >
        <FaCircle className={
            signalState?.currentLight === 'red' ? 'text-red-500' :
            signalState?.currentLight === 'yellow' ? 'text-yellow-500' :
            'text-green-500'
        } />
        <span className="text-gray-400">
            Current: <span className="font-semibold text-white">
            {(signalState?.currentLight || '').toUpperCase()}
            </span>
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-400">
            Time: <span className="font-mono font-semibold text-white">
            {signalState.remainingTime}s
            </span>
        </span>
        </motion.div>
    );
    };

    export default StatusDisplay;