// Copyright (c) 2023. Divisa iT SAU

export const getSenderSyncWorker = ()=>{
    return {
        postMessage : jest.fn(),
        onmessage: jest.fn(),
        terminate: jest.fn()
    }
}
export const getReceiverSyncWorker = ()=>{
    return {
        postMessage : jest.fn(),
        onmessage: jest.fn(),
        terminate: jest.fn()
    }
}