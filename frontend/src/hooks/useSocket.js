    import { useEffect, useRef } from 'react';
    import { io } from 'socket.io-client';

    export const useSocket = (url, options) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(url, options);

        return () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        };
    }, [url, options]);

    return socketRef.current;
    };