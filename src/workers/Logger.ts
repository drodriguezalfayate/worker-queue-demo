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

/**
 * Simple worker logger, main idea is avoiding using `console.log` or `console.error` from worker but using
 * a common interface based on sendMessage, so main thread is the one responsible for writing log data. Use cases
 * could involve an electron application, in which we want to write data on a file.
 *
 * @author David Rodríguez Alfayate
 */
export class Logger {
    /**
     * Worker Name
     */
    worker: string;

    constructor(workerName:string) {
        this.worker = workerName;
    }

    /**
     * Sends a debug message to remote provider via postMessage
     *
     * @param message   Message to send
     */
    debug(message:string) {
        this.log('debug',message);
    }

    /**
     * Sends an info message to remote provider via postMessage
     *
     * @param message   Message to send
     */
    info(message:string) {
        this.log('info',message);
    }

    /**
     * Sends a warn message to remote provider via postMessage
     *
     * @param message   Message to send
     */
    warn(message:string) {
        this.log('warn',message);
    }

    /**
     * Sends a error message to remote provider via postMessage
     *
     * @param message   Message or error t¡o send
     */
    error(message:string|Error) {
        this.log('error',message);
    }

    /**
     * Sends a message to remote provider via postMessage in a level
     *
     * @param level     Log level
     * @param message   Message to send
     */
    log(level:'debug'|'info'|'error'|'warn',message:string|Error) {
        postMessage({type:'log',level,worker:this.worker,message});
    }
}