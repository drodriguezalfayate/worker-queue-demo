/**
 * MIT License
 *
 * Copyright (c) 2023 David Rodríguez Alfayate - Divisa iT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
const logger = new Logger('receiverWorker');
let timeoutHandler:NodeJS.Timeout;
let endpoint: string;


/**
 * This function is used to read data from remote server, we send our current status, and we expect to receive
 * a series of updates, which are sent as `ISynchronizationAction[]`
 */
async function syncFromRemote() {
    logger.debug('Processing remote requests, loading status from database');
    const localStorageStatus = await storage.getEntityStatus();
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