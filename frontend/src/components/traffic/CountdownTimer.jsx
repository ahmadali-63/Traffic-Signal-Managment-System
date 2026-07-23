    import React from 'react';
    import { motion } from 'framer-motion';

    const CountdownTimer = ({ time }) => {
    const getColor = () => {
        if (time <= 3) return 'text-red-500';
        if (time <= 5) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <motion.div
        key={time}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
        >
        <div className="text-6xl font-bold font-mono">
            <span className={getColor()}>
            {String(time).padStart(2, '0')}
            </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">seconds</div>
        </motion.div>
    );
    };

    export default CountdownTimer;