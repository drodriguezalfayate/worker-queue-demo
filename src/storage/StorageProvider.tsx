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