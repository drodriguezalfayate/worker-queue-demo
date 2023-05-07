import {createContext} from "react";
import {QueueableStorage} from "./QueueableStorage";
import {ISynchronizable} from "./models/ISynchronizable";


/**
 * Context variable used to store PersonStorage database access, it shouldn't be used out of StorageProvider or
 * useStorage
 *
 * @author David Rodríguez Alfayate (drodriguez@divisait.com)
 */
export const StorageContext = createContext<QueueableStorage<any>|null>(null)