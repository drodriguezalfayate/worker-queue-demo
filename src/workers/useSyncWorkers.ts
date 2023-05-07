// Copyright (c) 2023. Divisa iT

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