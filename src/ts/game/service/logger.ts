// import config from 'config';

// const enabled: boolean = config.get("logger.enabled");
const enabled: boolean = true;
let logMessage;
let logError;
if (enabled) {
    logMessage = (...msg: any) => console.log(...msg);
    logError = (...msg: any) => console.error(...msg);
} else {
    logMessage = (...msg: any) => {};
    logError = (...msg: any) => {};
}

export default { logMessage, logError };