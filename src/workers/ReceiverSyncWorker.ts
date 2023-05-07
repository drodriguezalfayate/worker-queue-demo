// Copyright (c) 2023. Divisa iT SAU

import {QueueableStorage} from "../storage/QueueableStorage";
import {Logger} from "./Logger";
import {IWorkerAction} from "./IWorkerAction";
import {ISynchronizationAction} from "../storage/models/ISynchronizationAction";

/**
 * This worker purpose is just reading data from database, sending it to a remote endpoint
 *
 * @author David Rodríguez Alfayate
 */

// Access to local indexedb engine. Consider that neither actual type nor orderType
// is important for queueing and sending information
export const storage = new QueueableStorage((input)=>input);
const SEND_TIMEOUT = 5000;
const logger = new Logger('senderWorker');
let timeoutHandler:NodeJS.Timeout;
let endpoint: string;


/**
 * This function is used to read data from remote server, we send our current status, and we expect to receive
 * a series of updates, which are sent as `ISynchronizationAction[]`
 */
async function syncFromRemote() {
    logger.debug('Processing remote requests, loading status from database');
    const localStorageStatus = await storage.getEntityStatus();
    let synced = 0;
    try {
        // Send data to remote endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(localStorageStatus)
        });
        // We recover changes and we insert data in database
        const content = await response.json() as ISynchronizationAction<any>[];
        logger.debug(`We've to sync ${content.length} changes`);

        for(let i=0;i<content.length;i++) {
            logger.debug(`Syncing ${JSON.stringify(content[i])}`);
            await storage.syncExternalUser(content[i]);
        }
        // If we have changes, we send a sync option
        if(content.length>0) {
            // eslint-disable-next-line no-restricted-globals
            self.postMessage({type:'sync'});
        }

    }catch(e) {
        if(e instanceof Error) {
            logger.error(e);
        } else {
            logger.error(e?e.toString():'Unknown error processing data');
        }
    }


    timeoutHandler = setTimeout(async ()=>{
        await syncFromRemote();
    },SEND_TIMEOUT);
}

export async function onReceive(msg:MessageEvent<IWorkerAction>) {
    if(msg.data.action === 'startup') {
        logger.debug('Starting SenderWorker processing')
        endpoint = msg.data.endpoint;
        await syncFromRemote();
    } else if(timeoutHandler) {
        logger.debug('Stopping SenderWorker processing')
        clearTimeout(timeoutHandler);
    }
};

// eslint-disable-next-line no-restricted-globals
self.onmessage = async (msg:MessageEvent<IWorkerAction>)=> {
    await onReceive(msg);
};