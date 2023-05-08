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

import {Logger} from "./Logger";

test('Logging debug',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('debug');
        expect(message.message).toBe('Hola');
    })
    // eslint-disable-next-line testing-library/no-debugging-utils
    l.debug('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})

test('Logging info',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('info');
        expect(message.message).toBe('Hola');
    })
    l.info('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})

test('Logging warn',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('warn');
        expect(message.message).toBe('Hola');
    })
    l.warn('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})


test('Logging error',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('error');
        expect(message.message).toBe('Hola');
    })
    l.error('Hola');
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})


test('Logging error with error',()=>{
    const l = new Logger('worker');
    // eslint-disable-next-line no-restricted-globals
    self.postMessage = jest.fn((message:any)=>{
        expect(message.worker).toBe('worker');
        expect(message.level).toBe('error');
        expect(message.message.message).toBe('pepe');
    })
    l.error(new Error('pepe'));
    // eslint-disable-next-line no-restricted-globals
    expect(self.postMessage).toHaveBeenCalledTimes(1);


})