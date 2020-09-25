// import config from 'config';

// const enabled: boolean = config.get("logger.enabled");
const enabled = true;
let logMessage;
let logError;
if (enabled) {
    logMessage = (...msg: any): void => console.log(...msg);
    logError = (...msg: any): void => console.error(...msg);
} else {
    logMessage = (...msg: any): void => {
        //
    };
    logError = (...msg: any): void => {
        //
    };
}

export default { logMessage, logError };