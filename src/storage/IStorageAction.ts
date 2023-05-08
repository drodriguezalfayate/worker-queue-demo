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
import {ISynchronizable} from "./models/ISynchronizable";

/**
 * Interface which defines the output of useStorage hook
 *
 * @author David Rodríguez Alfayate
 */
export interface IStorageAction<T extends ISynchronizable> {
    /**
     * Method which allows to read stored data
     * @param offset    Initial position
     * @param len       Number of elements to read
     */
    reader:(offset:number,len:number)=>Promise<T[]>;

    /**
     * Method which allows to update an entity row in the local system
     *
     * @param data  Entity information to update it must exist previously
     */
    update:(data:T)=>Promise<void>,

    /**
     * Method which allows to delete a entity row in the local system
     *
     * @param data Entity to remove
     */
    delete:(data:T)=>Promise<void>,

    /**
     * Method which allows to create a new entity row in the local system
     *
     * @param data    The person to create
     */
    create:(data:T)=>Promise<void>
}