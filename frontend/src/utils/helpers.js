    export const formatTime = (seconds) => {
    return String(seconds).padStart(2, '0');
    };

    export const getStatusColor = (light) => {
    const colors = {
        red: 'text-red-500',
        yellow: 'text-yellow-500',
        green: 'text-green-500',
    };
    return colors[light] || 'text-gray-500';
    };

    export const getStatusMessage = (light) => {
    const messages = {
        red: 'STOP',
        yellow: 'READY',
        green: 'GO',
    };
    return messages[light] || '';
    };

    export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
        clearTimeout(timeout);
        func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
    };