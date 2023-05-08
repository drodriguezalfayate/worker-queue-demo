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
    const [people,setPeople] = useState<Person[]|undefined>();
    const [personToEdit,setPersonToEdit] = useState<Person|boolean|undefined>();

    // State used to know if we need reload data from storage, for example
    // when we modify local data, or remote data is updated
    const [needsReading,setReload] = useState<boolean>(true);

    const storage = useStorage<Person>();


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