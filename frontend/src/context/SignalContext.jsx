    import React, { createContext, useState, useContext, useEffect } from 'react';
    import { io } from 'socket.io-client';
    import api from '../services/api';
    import toast from 'react-hot-toast';

    const SignalContext = createContext();

    export const useSignal = () => useContext(SignalContext);

    export const SignalProvider = ({ children }) => {
    const [signalState, setSignalState] = useState({
        currentLight: 'red',
        remainingTime: 5,
        mode: 'auto',
        status: 'stopped',
        totalCycles: 0,
        redDuration: 5,
        yellowDuration: 5,
        greenDuration: 20
    });
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
        
        newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        });

        newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
        });

        newSocket.on('signal:state', (state) => {
        setSignalState(state);
        });

        setSocket(newSocket);

        // Load initial state
        fetchState();

        return () => {
        newSocket.close();
        };
    }, []);

    const fetchState = async () => {
        try {
        const response = await api.get('/signal/state');
        setSignalState(response.data);
        } catch (error) {
        console.error('Error fetching signal state:', error);
        }
    };

    const startSignal = async () => {
        try {
        await api.post('/signal/start');
        toast.success('Signal started');
        } catch (error) {
        toast.error('Failed to start signal');
        }
    };

    const pauseSignal = async () => {
        try {
        await api.post('/signal/pause');
        toast.success('Signal paused');
        } catch (error) {
        toast.error('Failed to pause signal');
        }
    };

    const resumeSignal = async () => {
        try {
        await api.post('/signal/resume');
        toast.success('Signal resumed');
        } catch (error) {
        toast.error('Failed to resume signal');
        }
    };

    const stopSignal = async () => {
        try {
        await api.post('/signal/stop');
        toast.success('Signal stopped');
        } catch (error) {
        toast.error('Failed to stop signal');
        }
    };

    const resetSignal = async () => {
        try {
        await api.post('/signal/reset');
        toast.success('Signal reset');
        } catch (error) {
        toast.error('Failed to reset signal');
        }
    };

    const switchMode = async (mode) => {
        try {
        await api.post('/signal/mode', { mode });
        toast.success(`Switched to ${mode} mode`);
        } catch (error) {
        toast.error('Failed to switch mode');
        }
    };

    const updateSettings = async (settings) => {
        try {
        await api.put('/settings', settings);
        toast.success('Settings updated');
        } catch (error) {
        toast.error('Failed to update settings');
        }
    };

    const value = {
        signalState,
        socket,
        connected,
        startSignal,
        pauseSignal,
        resumeSignal,
        stopSignal,
        resetSignal,
        switchMode,
        updateSettings,
        fetchState
    };

    return <SignalContext.Provider value={value}>{children}</SignalContext.Provider>;
    };