    import React from 'react';
    import { motion } from 'framer-motion';
    import { useSignal } from '../../context/SignalContext';
    import {
    FaPlay,
    FaPause,
    FaStop,
    FaUndo,
    FaStepForward,
    FaSync,
    FaRobot,
    FaUser,
    } from 'react-icons/fa';

    const ControlPanel = () => {
    const {
        signalState,
        startSignal,
        pauseSignal,
        resumeSignal,
        stopSignal,
        resetSignal,
        switchMode,
    } = useSignal();

    const isRunning = signalState.status === 'running';
    const isPaused = signalState.status === 'paused';
    const isStopped = signalState.status === 'stopped';
    const isAuto = signalState.mode === 'auto';

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6"
        >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaStepForward className="text-blue-400" />
            Control Panel
        </h2>

        <div className="grid grid-cols-2 gap-3">
            {/* Start Button */}
            <button
            onClick={startSignal}
            disabled={isRunning && !isPaused}
            className="flex items-center justify-center gap-2 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <FaPlay />
            Start
            </button>

            {/* Pause/Resume Button */}
            <button
            onClick={isPaused ? resumeSignal : pauseSignal}
            disabled={!isRunning || isStopped}
            className="flex items-center justify-center gap-2 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isPaused ? <FaPlay /> : <FaPause />}
            {isPaused ? 'Resume' : 'Pause'}
            </button>

            {/* Stop Button */}
            <button
            onClick={stopSignal}
            disabled={!isRunning && !isPaused}
            className="flex items-center justify-center gap-2 p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <FaStop />
            Stop
            </button>

            {/* Reset Button */}
            <button
            onClick={resetSignal}
            className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
            >
            <FaUndo />
            Reset
            </button>

            {/* Auto Mode Button */}
            <button
            onClick={() => switchMode('auto')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                isAuto ? 'bg-green-500/30 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            >
            <FaRobot />
            Auto
            </button>

            {/* Manual Mode Button */}
            <button
            onClick={() => switchMode('manual')}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                !isAuto ? 'bg-green-500/30 text-green-400' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            >
            <FaUser />
            Manual
            </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Status:</span>
            <span className={`font-semibold ${
                isRunning && !isPaused ? 'text-green-400' :
                isPaused ? 'text-yellow-400' :
                'text-red-400'
            }`}>
                {isRunning && !isPaused ? 'RUNNING' :
                isPaused ? 'PAUSED' :
                'STOPPED'}
            </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Mode:</span>
            <span className="font-semibold text-blue-400">
                {isAuto ? 'AUTO' : 'MANUAL'}
            </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-400">Current Light:</span>
            <span className={`font-semibold ${
                signalState?.currentLight === 'red' ? 'text-red-400' :
                signalState?.currentLight === 'yellow' ? 'text-yellow-400' :
                'text-green-400'
            }`}>
                {(signalState?.currentLight || '').toUpperCase()}
            </span>
            </div>
        </div>
        </motion.div>
    );
    };

    export default ControlPanel;