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

import {useContext, useMemo} from "react";
import {StorageContext} from "./StorageContext";
import {IStorageAction} from "./IStorageAction";
import {ISynchronizable} from "./models/ISynchronizable";

/**
 * Hook which allows to perform basic operation on local database engine such as read, update, create
 * and delete
 *
 * @author David Rodríguez Alfayate (drodriguez@divisait.com)
 */
export function useStorage<T extends ISynchronizable>():IStorageAction<T>|undefined {
    const ctx = useContext(StorageContext);
    return useMemo(()=>{
        if(!ctx) return undefined;
        return {
            reader:(offset:number,len:number)=>ctx.getEntities(offset,len),
            update:(data:T)=>ctx.updateEntity(data),
            create:(data:T)=>ctx.createEntity(data),
            delete:(data:T)=>ctx.deleteEntity(data)
        }
    },[ctx]);
}