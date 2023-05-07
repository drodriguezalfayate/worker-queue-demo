// Copyright (c) 2023. Divisa iT SAU

import {QueueableStorage} from "../storage/QueueableStorage";
import {Logger} from "./Logger";
import {IWorkerAction} from "./IWorkerAction";

/**
 * This worker purpose is reading updated data from external system, it receives a series of updates, information
 * as, for example, DELETED, PATCHED or CREATED registers, inserting them in local database system, so this
 * application has access to all updated information.
 *
 * @author David Rodríguez Alfayate
 */

// Access to local indexedb engine, we are just using a non transformation. Consider that neither actual type nor oderType
// is important for queueing and sending information
const storage = new QueueableStorage((input)=>input);
const RECEIVE_TIMEOUT = 5000;
const logger = new Logger('receiverWorker');
let timeoutHandler:NodeJS.Timeout;
let endpoint: string;

/**
 * This function allows sending data to remote server, a transaction for each entity row that has been updated
 * int the queue
 */
async function syncToRemote() {
    logger.debug('Processing local queue, sending changes to remote endpoint');
    await storage.processQueue((data)=>{
        logger.debug(`Sending ${JSON.stringify(data)} to remote endpoint`)
        return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(e=>e.json())
    });

    timeoutHandler = setTimeout(async ()=>{
        await syncToRemote();
    },RECEIVE_TIMEOUT);
}

export async function onReceive(msg:MessageEvent<IWorkerAction>) {
    if (msg.data.action === 'startup') {
        logger.debug('Starting ReceiveWorker processing')
        endpoint = msg.data.endpoint;
        await syncToRemote();
    } else if (timeoutHandler) {
        logger.debug('Stopping ReceiveWorker processing')
        clearTimeout(timeoutHandler);
    }
}

// eslint-disable-next-line no-restricted-globals
self.onmessage = async (msg:MessageEvent<IWorkerAction>)=> {
    await onReceive(msg);
};
