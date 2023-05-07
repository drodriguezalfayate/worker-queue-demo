// Copyright (c) 2023. Divisa iT SAU

/**
 * Data sent from main thread to worker as to init it properly
 *
 * @author David Rodríguez Alfayate
 */
export interface IWorkerAction {
    /**
     * Message action
     */
    action:'startup'|'shutdown';

    /**
     * Endpoint to send data
     */
    endpoint: string;

}