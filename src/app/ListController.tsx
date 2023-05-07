// Copyright (c) 2023. Divisa iT SAU

import {useStorage} from "../storage/useStorage";
import {Person} from "./models/Person";
import {useCallback, useEffect, useState} from "react";
import {useSyncWorkers} from "../workers/useSyncWorkers";
import {ListView} from "./ListView";
import {EditView} from "./EditView";
import {ILogMessage} from "../workers/ILogMessage";

/**
 * List Controller component, it starts worker, is responsible from different operations
 * as creating,deleting or updating data, and it also tries
 *
 * @author David Rodríguez Alfayate
 */
export function ListController() {
    const storage = useStorage<Person>();
    const [people,setPeople] = useState<Person[]|undefined>();
    const [personToEdit,setPersonToEdit] = useState<Person|boolean|undefined>();

    // State used to know if we need reload data from storage, for example
    // when we modify local data, or remote data is updated
    const [needsReading,setReload] = useState<boolean>(true);

    useEffect(()=>{
        if(needsReading) {
            // We are not supporting navigation, quite easy with Divisa iT
            // custom components, but this is a "simple" approach and
            // focus is not on presentation but worker behavior ;)
            storage?.reader(0, 1000).then((person => {
                setPeople(person);
            }))
            setReload(false);
        }
    },[needsReading,storage])

    const reloadFunction = useCallback(()=>setReload(true),[]);
    const logFunction = useCallback((log:ILogMessage)=>{
        switch (log.level) {
            case 'debug':
            case 'info':
                console.log(`${log.worker} ${log.message}`);
                break;
            case 'warn':
                console.warn(`${log.worker} ${log.message}`);
                break;
            default:
                console.warn(`${log.worker} ${log.message}`);

        }
    },[]);

    // We start workers
    useSyncWorkers(logFunction,'send','receive',reloadFunction);


    // Basic callback functions, from creating, updating or deleting
    // users
    const onSave = (person:Person)=>{
        setPersonToEdit(undefined);
        if(person.id) {
            storage?.update(person).then(reloadFunction)
        } else {
            storage?.create(person).then(reloadFunction)
        }
    }
    const onDelete = (person:Person)=>{
        storage?.delete(person).then(reloadFunction)
    }

    return <>
                <ListView onDelete={onDelete} people={people}
                          onEdit={(person:Person)=>setPersonToEdit(person)}
                          onCreate={()=>setPersonToEdit(true)}/>
                {personToEdit?<EditView onCancel={()=>setPersonToEdit(undefined)}
                                        person={typeof personToEdit!=='boolean'?personToEdit:undefined}
                                        onAction={onSave}/>:<></>}
          </>


}