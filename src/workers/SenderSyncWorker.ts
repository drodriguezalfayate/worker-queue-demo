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
const logger = new Logger('senderWorker');
let timeoutHandler:NodeJS.Timeout;
let endpoint: string;

/**
 * This function allows sending data to remote server, a transaction for each entity row that has been updated
 * int the queue
 */
async function syncToRemote() {
    logger.debug('Processing local queue, sending changes to remote endpoint');
    try {
        await storage.processQueue((data) => {
            logger.debug(`Sending ${JSON.stringify(data)} to remote endpoint`)
            return fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(e => e.json())
        });
    }catch(er) {
        logger.error(er as Error);
    }

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
