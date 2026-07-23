    import React from 'react';
    import { motion } from 'framer-motion';

    const SignalLight = ({ color, isActive }) => {
    const getColorClass = () => {
        if (!isActive) return 'bg-gray-700';
        switch (color) {
        case 'red': return 'bg-red-500 shadow-red-500/50 animate-pulse';
        case 'yellow': return 'bg-yellow-500 shadow-yellow-500/50 animate-pulse';
        case 'green': return 'bg-green-500 shadow-green-500/50 animate-pulse';
        default: return 'bg-gray-700';
        }
    };

    const getGlowClass = () => {
        if (!isActive) return '';
        switch (color) {
        case 'red': return 'shadow-[0_0_30px_rgba(239,68,68,0.5)]';
        case 'yellow': return 'shadow-[0_0_30px_rgba(234,179,8,0.5)]';
        case 'green': return 'shadow-[0_0_30px_rgba(34,197,94,0.5)]';
        default: return '';
        }
    };

    return (
        <motion.div
        initial={false}
        animate={{
            scale: isActive ? 1.1 : 1,
        }}
        transition={{
            duration: 0.3,
            type: 'spring',
            stiffness: 200,
        }}
        className="relative flex justify-center"
        >
        <div className="relative">
            <div
            className={`w-20 h-20 rounded-full transition-all duration-300 ${getColorClass()} ${getGlowClass()}`}
            />
            {isActive && (
            <div className={`absolute inset-0 rounded-full blur-xl ${getColorClass()} opacity-50 animate-ping`} />
            )}
        </div>
        </motion.div>
    );
    };

    export default SignalLight;