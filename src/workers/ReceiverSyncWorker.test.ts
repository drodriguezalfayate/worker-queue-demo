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

import "fake-indexeddb/auto";
import fakeIndexedDB from "fake-indexeddb";

import {onReceive} from './ReceiverSyncWorker'
import {QueueableStorage} from "../storage/QueueableStorage";
import {waitFor} from "@testing-library/react";
import {Action} from "../storage/models/Action";
jest.useFakeTimers()
beforeEach(()=>{
    fakeIndexedDB.deleteDatabase('worker-demo-db');
})

test('Testing receiving data from remote frontend',async()=>{
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn(()=>{
    })
    // eslint-disable-next-line no-restricted-globals
    self.fetch = jest.fn(()=>{
        return Promise.resolve({contentType:'application/json',status:204,json:()=>Promise.resolve([])} as unknown as Response)
    });
    await onReceive({data:{action:"startup",endpoint:'pepe'}} as unknown as MessageEvent);
    const storage = new QueueableStorage((input)=>input)
    let entities = await storage.getEntities(0,1000);
    expect(entities.length).toBe(0);

    // eslint-disable-next-line no-restricted-globals
    self.fetch = jest.fn(()=>{
        return Promise.resolve({contentType:'application/json',status:204,json:()=>Promise.resolve([{
                action:Action.CREATED,
                entity:{
                    uri:'aaaa',
                    name:'dsfdsfds'
                }
            }])} as unknown as Response)
    });
    jest.runAllTimers();

    await waitFor(async ()=>{
        entities = await storage.getEntities(0,1000);
        expect(entities.length).toBe(1);
    })

    // eslint-disable-next-line no-restricted-globals
    self.fetch = jest.fn(()=>{
        return Promise.resolve({contentType:'application/json',status:204,json:()=>Promise.resolve([{
                action:Action.DELETED,
                entity:{
                    uri:'aaaa',
                    name:'dsfdsfds'
                }
            }])} as unknown as Response)
    });
    jest.runAllTimers();

    await waitFor(async ()=>{
        entities = await storage.getEntities(0,1000);
        expect(entities.length).toBe(0);
    })

    // Ahora paramos todos los timeout y vamos a intentar añadir, uno debería estar la
    // cola vacía.
    await onReceive({data:{action:"shutdown"}} as unknown as MessageEvent);
    jest.runAllTimers();

    // eslint-disable-next-line no-restricted-globals
    self.fetch = jest.fn(()=>{
        return Promise.resolve({contentType:'application/json',status:204,json:()=>Promise.resolve([{
                action:Action.CREATED,
                entity:{
                    uri:'aaaa',
                    name:'dsfdsfds'
                }
            }])} as unknown as Response)
    });
    jest.runAllTimers();
    // We expect database not storing any value, since we have stopped the "worker"
    // previously
    await waitFor(async ()=>{
        entities = await storage.getEntities(0,1000);
        expect(entities.length).toBe(0);
    })
})