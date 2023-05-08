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

import {onReceive} from './SenderSyncWorker'
import {QueueableStorage} from "../storage/QueueableStorage";
import {waitFor} from "@testing-library/react";
jest.useFakeTimers()
beforeEach(()=>{
    fakeIndexedDB.deleteDatabase('worker-demo-db');
})
test('Testing sending data to remote frontend',
    async () => {
        // eslint-disable-next-line no-restricted-globals
        self.postMessage = jest.fn(() => {
        })
        // eslint-disable-next-line no-restricted-globals
        self.fetch = jest.fn(() => {
            return Promise.resolve({
                contentType: 'application/json',
                status: 204,
                json: () => Promise.resolve([])
            } as unknown as Response)
        });
        const storage = new QueueableStorage((input) => input)
        await storage.createEntity({uri: 'demo', name: 'Jhon Rham'})
        await onReceive({data: {action: "startup", endpoint: 'pepe'}} as unknown as MessageEvent);

        // eslint-disable-next-line no-restricted-globals
        expect(self.fetch).toBeCalledTimes(1);
        jest.runAllTimers();

        // Queue should be empty, this call shouldn't have done anything
        await waitFor(async () => {
            // eslint-disable-next-line no-restricted-globals
            expect(self.fetch).toBeCalledTimes(1);
        })
        // We create a new entry, executing timing fetch should have been called
        await storage.createEntity({uri: 'demo', name: 'Jhon Rham'})
        jest.runAllTimers();

        // Queue is not empty, the number of calls should be two
        await waitFor(async () => {
            // eslint-disable-next-line no-restricted-globals
            expect(self.fetch).toBeCalledTimes(2);
        })

        // Stop worker, we are going to create a new entry, but since worker is stopped
        // self.fetch shouldn't have been called more times
        await onReceive({data: {action: "shutdown", endpoint: 'pepe'}} as unknown as MessageEvent);
        await storage.createEntity({uri: 'demo', name: 'Jhon Rham'})
        jest.runAllTimers();

        // Although queue is not empty, timeout system is stopped, so fetch shouldn't have
        // been called
        await waitFor(async () => {
            // eslint-disable-next-line no-restricted-globals
            expect(self.fetch).toBeCalledTimes(2);
        })


    })