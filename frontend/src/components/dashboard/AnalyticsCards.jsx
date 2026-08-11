    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import api from '../../services/api';
    import {
    FaChartLine,
    FaClock,
    FaCalendarDay,
    FaUsers,
    } from 'react-icons/fa';

    const AnalyticsCards = () => {
    const [analytics, setAnalytics] = useState({
        totalCycles: 0,
        todayCycles: 0,
        avgCycleTime: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
        const response = await api.get('/analytics/dashboard');
        setAnalytics(response.data);
        } catch (error) {
        console.error('Error fetching analytics:', error);
        } finally {
        setLoading(false);
        }
    };

    const cards = [
        {
        title: 'Total Cycles',
        value: analytics.totalCycles,
        icon: FaChartLine,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        },
        {
        title: "Today's Cycles",
        value: analytics.todayCycles,
        icon: FaCalendarDay,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        },
        {
        title: 'Avg Cycle Time',
        value: `${Math.round(analytics.avgCycleTime)}s`,
        icon: FaClock,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        },
        {
        title: 'Total Users',
        value: analytics.totalUsers,
        icon: FaUsers,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        },
    ];

    if (loading) {
        return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass p-6 animate-pulse">
                <div className="h-20 bg-slate-800/60 rounded" />
            </div>
            ))}
        </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
            <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6"
            >
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`text-xl ${card.color}`} />
                </div>
            </div>
            </motion.div>
        ))}
        </div>
    );
    };

    export default AnalyticsCards;