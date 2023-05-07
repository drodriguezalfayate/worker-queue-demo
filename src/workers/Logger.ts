// Copyright (c) 2023. Divisa iT SAU

/**
 * Simple worker logger, main idea is avoiding using `console.log` or `console.error` from worker but using
 * a common interface based on sendMessage, so main thread is the one responsible for writing log data. Use cases
 * could involve an electron application, in which we want to write data on a file.
 *
 * @author David Rodríguez Alfayate
 */
export class Logger {
    /**
     * Worker Name
     */
    worker: string;

    constructor(workerName:string) {
        this.worker = workerName;
    }

    /**
     * Sends a debug message to remote provider via postMessage
     *
     * @param message   Message to send
     */
    debug(message:string) {
        this.log('debug',message);
    }

    /**
     * Sends an info message to remote provider via postMessage
     *
     * @param message   Message to send
     */
    info(message:string) {
        this.log('info',message);
    }

    /**
     * Sends a warn message to remote provider via postMessage
     *
     * @param message   Message to send
     */
    warn(message:string) {
        this.log('warn',message);
    }

    /**
     * Sends a error message to remote provider via postMessage
     *
     * @param message   Message or error t¡o send
     */
    error(message:string|Error) {
        this.log('error',message);
    }


    /**
     * Sends a message to remote provider via postMessage in a level
     *
     * @param level     Log level
     * @param message   Message to send
     */
    log(level:'debug'|'info'|'error'|'warn',message:string|Error) {
        postMessage({type:'log',level,worker:this.worker,message});
    }
}