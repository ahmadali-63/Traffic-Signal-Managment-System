    import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import TrafficSignal from '../components/traffic/TrafficSignal';
    import { useAuth } from '../context/AuthContext';

    const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg to-gray-900" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Main Content */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full max-w-4xl"
        >
            <div className="text-center mb-8">
            <motion.h1
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
                Traffic Signal
            </motion.h1>
            <p className="text-gray-400 mt-2 text-lg">Real-time Traffic Management System</p>
            </div>

            <TrafficSignal />

            <div className="mt-8 flex justify-center gap-4">
            {!isAuthenticated ? (
                <Link to="/login">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                    Admin Dashboard
                </motion.button>
                </Link>
            ) : (
                <Link to="/dashboard">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
                >
                    Go to Dashboard
                </motion.button>
                </Link>
            )}
            </div>
        </motion.div>
        </div>
    );
    };

    export default Home;