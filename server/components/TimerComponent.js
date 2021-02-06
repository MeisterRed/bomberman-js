// TIME_FORMATS
const TIME_FORMATS = Object.freeze({
    MS:         'MS',   
    SECS:       'SECS',
    MINS:       'MINS',
    MIN_STR:    'MIN_STR'
})
module.exports.TIME_FORMATS = TIME_FORMATS;

// Maps keywords to functions that format ms time to other formats
const TIME_FORMATTERS = Object.freeze({
    MS:         time => time,
    SECS:       time => time/1000,
    MINS:       time => time/(1000*60),
    MIN_STR:    time => {
                    let secs = Math.floor(time/1000);
                    let mins = Math.floor(secs/60);
                    return '' + mins + ':' + (secs%60);
                }
});
 
/**
 * Utility class representing one timer
 * @param {number} countdown    Time in ms to countdown 
 * @param {funtion} callback    Function to run when timer is finished
 * @param {list} callbackArgs   Argumnets to callback fn
 * @param {FORMATS} defaultFormat   the default format to use when checking time; if null, defaults to milliseconds
 */
// TODO : consider adding offset param if immediate next timer needed
function Timer(countdown, callback, callbackArgs, defaultFormat) { 
    this.countdown      = countdown;
    this.callback       = callback;
    this.callbackArgs   = callbackArgs;
    this.elapsed        = 0;
    this.lastTimeStamp  = null;
    this.isDone         = false;
    this.isRunning      = false;

    if (defaultFormat && TIME_FORMATS[defaultFormat]) {
        this.defaultFormatter = TIME_FORMATTERS[defaultFormat];
    } 
    else {
        this.defaultFormatter = TIME_FORMATTERS[ TIME_FORMATS.MS ];
    }
}


// Methods to play, pause, stop and finish the timer
Timer.prototype.play = function() {
    this.isRunning = true;
    this.lastTimeStamp  = Date.now();
}
Timer.prototype.pause = function () {
    this.isRunning = false;
}
Timer.prototype.finish = function () {
    this.pause();
    this.isDone = true;
    this.callback(...this.callbackArgs);
}

// Update the elapsed time, and execute callback when complete
Timer.prototype.update = function () {
    if (this.isRunning) {
        let currTimeStamp = Date.now();
        this.elapsed += currTimeStamp - this.lastTimeStamp;
        this.lastTimeStamp = currTimeStamp;
        if (this.elapsed >= this.countdown) {
            this.finish();
        }
    }
}

// Methods to get elapsed time and time left, using provided format or defaultFormat
Timer.prototype.getTimeElapsed = function (format) {
    let formatter = this.getFormatterOrDefault(format);
    return formatter(this.elapsed);
}
Timer.prototype.getTimeLeft = function (format) {
    let formatter = this.getFormatterOrDefault(format);
    return formatter(this.countdown - this.elapsed);
}

Timer.prototype.getFormatterOrDefault = function (format) {
    if (format && TIME_FORMATS[format]) {
        return TIME_FORMATTERS[format];
    }
    return this.defaultFormatter;
}





/**
 * Constructs the Timer Component
 */
module.exports.TimerComponent = function() {
    this.timers         = {};       // Maps timer names to Timer objects
    this.defaultTimerId = null;     // The first timer added
    
    let nextTimerId = 1;
    this.getNextTimerId = function() {
        return nextTimerId++;
    }
}


/**
 * Adds a timer to the timer component
 * @param {number} time                 time in milliseconds to count down
 * @param {function} callback           function to execute when timer is done 
 * @param {list} callbackArgs           arguments for callback
 * @param {TIME_FORMATS} defaultFormat  [OPT] the default format for this timer
 * @param {string} name      `          [OPT] a name for the timer. Must be truthy. If none provided 
 *                                              or already in use, use nextTimerId
 */
module.exports.TimerComponent.prototype.addTimer = function(time, callback, callbackArgs, defaultFormat, name) {
    // If name not provided or is already in use, use nextTimerId 
    let timerId = (name && !this.timers[name]) ? name : this.getNextTimerId();
    let timer = new Timer(time, callback, callbackArgs, defaultFormat);
    this.timers[timerId] = timer;

    // If this is the only timer, make it the default timer
    if (this.defaultTimerId === null) {
        this.defaultTimerId = timerId;
    }
    return timerId;
}

/**
 * Removes the specified timer.
 * @param {*} timerId 
 */
module.exports.TimerComponent.prototype.removeTimer = function(timerId) {
    if (this.timers[timerId]) {
        delete this.timers[timerId];
        if (timerId === this.mainTimerId) {
            this.mainTimerId = null; 
        }
    }
}

/**
 * Updates the timer component
 */
module.exports.TimerComponent.prototype.update = function() {
    let finishedTimers = [];
    for (let timerId in this.timers) {
        let timer = this.timers[timerId];
        timer.update();
        if (timer.isDone()) {
            finishedTimers.push(timerId);
        }
    }
    for (let i = 0; i < finishedTimers.length; i++) {
        this.removeTimer(finishedTimers[i]);
    }
}


module.exports.TimerComponent.prototype.playTimer = function(timerId) {
    let timer = this.getTimerOrDefault(timerId);
    if (timer) {
        timer.play();
    }
}

module.exports.TimerComponent.prototype.pauseTimer = function (timerId) {
    let timer = this.getTimerOrDefault(timerId);
    if (timer) {
        timer.pause();
    }
}

module.exports.TimerComponent.prototype.checkTimeElapsed = function(format, timerId) {
    let timer = this.getTimerOrDefault(timerId);
    if (timer) {
        return timer.getTimeElapsed(format);
    }
}

module.exports.TimerComponent.prototype.checkTimeLeft = function (format, timerId) {
    let timer = this.getTimerOrDefault(timerId);
    if (timer) {
        return timer.getTimeLeft(format);
    }
}

module.exports.TimerComponent.prototype.getTimerOrDefault = function (timerId) {
    if (timerId && this.timers[timerId]) {
        return this.timers[timerId];
    }
    if (this.defaultTimerId) {
        return this.timers[this.defaultTimerId];
    }
    return null
}