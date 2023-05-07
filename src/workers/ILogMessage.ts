// Copyright (c) 2023. Divisa iT

import {IWorkerMessage} from "./IWorkerMessage";

/**
 * Interface for holding log messages
 *
 * @author David Rodríguez Alfayate
 */
export interface ILogMessage extends IWorkerMessage {
    /**
     * Log level
     */
    level: 'debug'|'info'|'warn'|'error';

    /**
     * Worker responible of the error
     */
    worker:string;

    /**
     * Messaje, could be a string or an error
     */
    message:'string'|Error;
}