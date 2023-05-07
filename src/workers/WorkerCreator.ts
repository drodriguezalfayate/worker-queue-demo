// Copyright (c) 2023. Divisa iT SAU

/**
 * Simple util function, that we have created in order to be easily mocked by jest
 * @param file file to create worker from
 *
 */
export const getSenderSyncWorker = ()=>{
    return new Worker(new URL('./SenderSyncWorker.ts',import.meta.url));
}
export const getReceiverSyncWorker = ()=>{
    return new Worker(new URL('./ReceiverSyncWorker.ts',import.meta.url));
}