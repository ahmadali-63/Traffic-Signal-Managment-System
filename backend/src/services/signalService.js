const SignalSettings = require('../models/SignalSettings');
const SignalHistory = require('../models/SignalHistory');
const ActivityLog = require('../models/ActivityLog');
const { getIO } = require('../config/socket');

class SignalService {
    constructor() {
    this.settings = null;
    this.timer = null;
    this.isRunning = false;
    this.isPaused = false;
    this.cycleCount = 0;
    this.startTime = null;
    this.cycleStartTime = null;
    this.remainingTime = 0;
}

    async initialize() {
    this.settings = await SignalSettings.getDefaultSettings();
    this.remainingTime = this.settings.remainingTime || this.settings.redDuration;
    this.cycleCount = this.settings.totalCycles || 0;
    
    if (this.settings.status === 'running') {
        this.isRunning = true;
        this.startSignalLoop();
    }
}

    getCurrentState() {
    const settings = this.settings || {
        currentLight: 'red',
        mode: 'auto',
        status: 'stopped',
        redDuration: 5,
        yellowDuration: 5,
        greenDuration: 20
    };
    return {
        currentLight: settings.currentLight,
        remainingTime: this.remainingTime,
        mode: settings.mode,
        status: settings.status,
        totalCycles: this.cycleCount,
        redDuration: settings.redDuration,
        yellowDuration: settings.yellowDuration,
        greenDuration: settings.greenDuration
    };
}

    async startSignal() {
    if (this.isRunning) return;

    this.settings.status = 'running';
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = new Date();
    this.cycleStartTime = new Date();
    
    if (!this.remainingTime || this.remainingTime <= 0) {
        const durations = {
            red: this.settings.redDuration,
            yellow: this.settings.yellowDuration,
            green: this.settings.greenDuration
        };
        this.remainingTime = durations[this.settings.currentLight];
    }
    
    this.settings.remainingTime = this.remainingTime;
    await this.settings.save();
    await this.logActivity('START', 'Signal started');
    
    this.startSignalLoop();
    this.emitState();
}

    async pauseSignal() {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    this.settings.status = 'paused';
    this.settings.remainingTime = this.remainingTime;
    if (this.timer) clearTimeout(this.timer);
    
    await this.settings.save();
    await this.logActivity('PAUSE', 'Signal paused');
    this.emitState();
}

    async resumeSignal() {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.settings.status = 'running';
    
    await this.settings.save();
    await this.logActivity('RESUME', 'Signal resumed');
    
    this.startSignalLoop();
    this.emitState();
}

async stopSignal() {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.isPaused = false;
    if (this.timer) clearTimeout(this.timer);
    
    this.settings.status = 'stopped';
    this.settings.currentLight = 'red';
    this.remainingTime = this.settings.redDuration;
    this.settings.remainingTime = this.settings.redDuration;
    
    await this.settings.save();
    await this.logActivity('STOP', 'Signal stopped');
    this.emitState();
}

    async resetSignal() {
    await this.stopSignal();
    this.cycleCount = 0;
    this.startTime = null;
    this.cycleStartTime = null;
    this.remainingTime = this.settings.redDuration;
    this.settings.currentLight = 'red';
    this.settings.totalCycles = 0;
    this.settings.remainingTime = this.settings.redDuration;
    
    await this.settings.save();
    await this.logActivity('RESET', 'Signal reset');
    this.emitState();
}

    async updateSettings(newSettings) {
    const { redDuration, yellowDuration, greenDuration } = newSettings;
    
    this.settings.redDuration = redDuration;
    this.settings.yellowDuration = yellowDuration;
    this.settings.greenDuration = greenDuration;
    
    await this.settings.save();
    await this.logActivity('SETTINGS_UPDATE', `Updated durations: R=${redDuration}, Y=${yellowDuration}, G=${greenDuration}`);
    
    if (this.isRunning && !this.isPaused) {
        await this.stopSignal();
        await this.startSignal();
    }
    
    this.emitState();
    return this.settings;
}

    async switchMode(mode) {
    this.settings.mode = mode;
    await this.settings.save();
    await this.logActivity('MODE_SWITCH', `Switched to ${mode} mode`);
    
    if (mode === 'manual' && this.isRunning) {
        await this.stopSignal();
    } else if (mode === 'auto') {
        await this.startSignal();
    }
    
    this.emitState();
    return this.settings;
}

    startSignalLoop() {
    if (!this.isRunning || this.isPaused) return;

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(async () => {
        if (!this.isRunning || this.isPaused) return;

        this.remainingTime--;

        if (this.remainingTime <= 0) {
            if (this.settings.currentLight === 'green') {
                this.cycleCount++;
                this.settings.totalCycles = this.cycleCount;
                await this.saveCycleHistory();
                this.cycleStartTime = new Date();
            }

            const lightOrder = ['red', 'yellow', 'green'];
            const currentIndex = lightOrder.indexOf(this.settings.currentLight);
            const nextIndex = (currentIndex + 1) % 3;
            this.settings.currentLight = lightOrder[nextIndex];

            const durations = {
                red: this.settings.redDuration,
                yellow: this.settings.yellowDuration,
                green: this.settings.greenDuration
            };
            this.remainingTime = durations[this.settings.currentLight];
            
            this.settings.remainingTime = this.remainingTime;
            await this.settings.save();
        }

        this.emitState();
        this.startSignalLoop();
    }, 1000);
}

    async saveCycleHistory() {
    const history = new SignalHistory({
        redDuration: this.settings.redDuration,
        yellowDuration: this.settings.yellowDuration,
        greenDuration: this.settings.greenDuration,
        totalCycleDuration: this.settings.redDuration + this.settings.yellowDuration + this.settings.greenDuration,
        cycleNumber: this.cycleCount,
        startedAt: this.cycleStartTime || new Date(),
        completedAt: new Date(),
        mode: this.settings.mode
    });
    
    await history.save();
}

    async logActivity(action, details) {
    const log = new ActivityLog({
        action,
        details,
        timestamp: new Date()
    });
    await log.save();
}

    emitState() {
    const io = getIO();
    io.emit('signal:state', this.getCurrentState());
}
}

module.exports = new SignalService();