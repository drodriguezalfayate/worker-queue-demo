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
import {ReactNode, useState} from "react";
import {QueueableStorage} from "./QueueableStorage";
import {StorageContext} from "./StorageContext";
import {ISynchronizable} from "./models/ISynchronizable";

/**
 * Functional component. It should be used to wrap all application in order to make easier storage access
 * through custom hook useStorage
 *
 * @param decoder  Function which allows to decode stored data into end-user model
 * @param children  Children of this element
 *
 * @author David Rodríguez Alfayate
 */
export function StorageProvider<T extends ISynchronizable>({decoder,children}:{decoder:(input:any)=>T,children:ReactNode}) {
    const [storage] = useState<QueueableStorage<T>>(()=>new QueueableStorage<T>(decoder));
    return <StorageContext.Provider value={storage}>
                {children}
           </StorageContext.Provider>
}