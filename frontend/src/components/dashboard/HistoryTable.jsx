    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import api from '../../services/api';
    import toast from 'react-hot-toast';
    import { FaSearch, FaTrash, FaFileExport, FaCalendar } from 'react-icons/fa';

    const HistoryTable = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        mode: '',
        startDate: '',
        endDate: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
    });

    useEffect(() => {
        fetchHistory();
    }, [filters, pagination.page]);

    const fetchHistory = async () => {
        try {
        const params = new URLSearchParams({
            page: pagination.page,
            limit: pagination.limit,
            ...(filters.mode && { mode: filters.mode }),
            ...(filters.startDate && { startDate: filters.startDate }),
            ...(filters.endDate && { endDate: filters.endDate }),
        });

        const response = await api.get(`/history?${params}`);
        setHistory(response.data.history);
        setPagination({
            ...pagination,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages,
        });
        } catch (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load history');
        } finally {
        setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
        await api.delete(`/history/${id}`);
        toast.success('Record deleted successfully');
        fetchHistory();
        } catch (error) {
        toast.error('Failed to delete record');
        }
    };

    const handleExport = async () => {
        try {
        const response = await api.get('/history/export', {
            responseType: 'blob',
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'signal_history.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        toast.success('History exported successfully');
        } catch (error) {
        toast.error('Failed to export history');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        });
    };

    if (loading) {
        return (
        <div className="glass p-6">
            <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-1/4" />
            <div className="h-12 bg-white/5 rounded" />
            <div className="h-64 bg-white/5 rounded" />
            </div>
        </div>
        );
    }

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass p-6"
        >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Signal History</h2>
            <div className="flex flex-wrap items-center gap-4">
            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 transition-colors"
            >
                <FaFileExport />
                Export CSV
            </button>
            </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 mb-6 p-4 bg-white/5 rounded-lg md:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gray-400">
                <FaSearch />
                <span className="text-sm">Mode</span>
            </div>
            <select
                value={filters.mode}
                onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
                <option value="">All Modes</option>
                <option value="auto">Auto</option>
                <option value="manual">Manual</option>
            </select>
            </div>

            <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-400">
                <FaCalendar />
                <span className="text-sm">Date Range</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">From</label>
                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                </div>
                <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">To</label>
                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
                </div>
            </div>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead>
                <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Cycle #</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Red (s)</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Yellow (s)</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Green (s)</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Total (s)</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Mode</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Completed</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-400">Actions</th>
                </tr>
            </thead>
            <tbody>
                {history.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-400">
                    No history records found
                    </td>
                </tr>
                ) : (
                history.map((record) => (
                    <motion.tr
                    key={record._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                    <td className="py-2 px-3 font-mono">{record.cycleNumber}</td>
                    <td className="py-2 px-3 text-red-400">{record.redDuration}</td>
                    <td className="py-2 px-3 text-yellow-400">{record.yellowDuration}</td>
                    <td className="py-2 px-3 text-green-400">{record.greenDuration}</td>
                    <td className="py-2 px-3">{record.totalCycleDuration}</td>
                    <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                        record.mode === 'auto' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-purple-500/20 text-purple-400'
                        }`}>
                        {record.mode.toUpperCase()}
                        </span>
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-400">
                        {formatDate(record.completedAt)}
                    </td>
                    <td className="py-2 px-3">
                        <button
                        onClick={() => handleDelete(record._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                        >
                        <FaTrash />
                        </button>
                    </td>
                    </motion.tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-gray-400">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} records
            </div>
            <div className="flex gap-2">
                <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Previous
                </button>
                <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Next
                </button>
            </div>
            </div>
        )}
        </motion.div>
    );
    };

    export default HistoryTable;