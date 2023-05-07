// Copyright (c) 2023. Divisa iT SAU

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
            delete:(data:T)=>ctx.deleteUser(data)
        }
    },[ctx]);
}