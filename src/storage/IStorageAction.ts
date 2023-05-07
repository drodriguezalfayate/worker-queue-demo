// Copyright (c) 2023. Ayuntamiento de Valladolid
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