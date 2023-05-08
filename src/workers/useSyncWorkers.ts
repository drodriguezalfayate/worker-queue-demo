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

import {useEffect} from "react";
import {ILogMessage} from "./ILogMessage";
import {IWorkerMessage} from "./IWorkerMessage";
import {getReceiverSyncWorker, getSenderSyncWorker} from "./WorkerCreator";

/**
 * This hook inits all synchronization workers, enabling logging worker subsystem.
 *
 * @param  log  Logging function
 * @param  sendEndpoint Endpoint to send synchronization requests
 * @param  receiveEndpoint  Endpoint from where we receive synchronization updates
 * @param  sync     Callback function invoked when repainting and syncing information
 *                  is needed
 * @author David Rodríguez Alfayate
 */
export function useSyncWorkers(log:(log:ILogMessage)=>void,
                               sendEndpoint:string,
                               receiveEndpoint:string,
                               sync:()=>void) {
    useEffect(()=>{
        let senderSyncWorker = getSenderSyncWorker();
        let receiverSyncWorker = getReceiverSyncWorker();

        // We start logging subsystem on each worker before initialising them
        senderSyncWorker.onmessage = (e:MessageEvent<ILogMessage>)=>{
            log(e.data);
        }
        receiverSyncWorker.onmessage = (e:MessageEvent<IWorkerMessage>)=>{
            if(e.data.type === 'log') {
                log(e.data as ILogMessage);
                return;
            }
            sync();
        }

        // We send startup orders to workers.
        senderSyncWorker.postMessage({action:'startup',endpoint:sendEndpoint})
        receiverSyncWorker.postMessage({action:'startup',endpoint:sendEndpoint})

        return ()=>{
            senderSyncWorker.postMessage({action:'shutdown',endpoint:sendEndpoint})
            receiverSyncWorker.postMessage({action:'shutdown',endpoint:sendEndpoint})

            senderSyncWorker.terminate();
            receiverSyncWorker.terminate();
        }
    },[sendEndpoint,receiveEndpoint,sync,log]);
}