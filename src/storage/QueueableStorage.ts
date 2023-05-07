// Copyright (c) 2023. Divisa iT SAU

import Dexie, {IndexableTypePart, Table} from "dexie";
import {ISynchronizationAction} from "./models/ISynchronizationAction";
import {Action} from "./models/Action";
import {ISynchronizable} from "./models/ISynchronizable";
import {IEntityStatus} from "./models/IEntityStatus";
import {v4 as uuidv4} from 'uuid';


/**
 * Wrapper over Dexie in order to store different ISynchronizable objects, and a queue of pending actions. This approach
 * allows us to create different workers, those who send information to remote system and those which receive information
 * from it.
 * 
 * @author David Rodríguez Alfayate
 */
export class QueueableStorage<T extends ISynchronizable> extends Dexie {

    /**
     * Data table
     */
    data: Table<T&{timestamp?:number},number>

    /**
     * Queue table,
     */
    queue: Table;

    /**
     * Client identifier, for generating UID
     */
    system: Table;

    /**
     * Key for ordering results in where search
     */
    orderKey:string;

    /**
     * Decoder used to transform database data to external model data, we need
     * this information in order to warrant that returned data is in conformance
     * with its model
     */
    decoder: (input:any)=>T

    /*
     * Class constructor
     *
     * @param decoder   method which allows transforming stored data into external model
     * @param orderKey  The ordering key for the search method, is optional.
     */
    constructor(decoder:(input:any)=>T,orderKey?:string) {
        super('worker-demo-db');
        this.version(1).stores({
            data: `++id,uri,[timestamp+uri]${orderKey?`,${orderKey}`:''}`,
            queue: '++id,uri',
            system:'systemId'
        });

        this.decoder = decoder;
        this.orderKey = orderKey||'uri';
        this.data = this.table('data');
        this.system = this.table('system');
        this.on('populate',(tx)=>{
            tx.table('system').add({systemId:uuidv4()})
        })

        // We register some hooks to know object last modification date, very useful
        // for syncrhonization process
        this.data.hook('creating',(key,obj,trans)=>{
            obj.timestamp = Date.now();
        })
        this.data.hook('updating',(modifications,key,obj,trans)=>{
            return {timestamp:Date.now(),...modifications};
        })
        this.queue = this.table('queue');
    }

    /**
     * Creates a local user from local form, this function involves synchronization queue, so it shouldn't be used from worker
     *
     * @param p Entity row to create
     */
    async createEntity(p:T) {
        await this.transaction('rw',this.system,this.data,this.queue,async()=>{
            const {systemId} = await this.system.toCollection().first();
            p.uri = `${systemId}:${Date.now()}`

            p.id = await this.data.add(p);

            await this.queue.add({uri:p.uri,action:Action.CREATED,timestamp:new Date()});
        });
    }

    /**
     * Update a local entity data from local form, this function involves synchronization queue, so it shouldn't be used from worker
     *
     * @param p Entity row to update
     */
    async updateEntity(p:T) {
        await this.transaction('rw',this.data,this.queue,async()=>{
            await this.data.update(p.id!,p);
            await this.queue.add({uri:p.uri,action:Action.PATCHED,timestamp:new Date()});
        });
    }

    /**
     * Removes an entity row from system, it stores a DELETE action on the replication queue removing all previous
     * entries from the same URI
     *
     * @param p Entity row to delete
     */
    async deleteUser(p:T) {
        await this.transaction('rw',this.data,this.queue,async()=>{
            await this.data.delete(p.id!);

            // We ensure all replicaiton data is deleted, avoiding invalid operations on replication queue
            // it's just a safety measure, worker should treat this properly
            await this.queue.where({uri:p.uri}).delete();
            await this.queue.add({uri:p.uri,action:Action.DELETED,timestamp:new Date()});
        });
    }

    /**
     * Reads Entities from storage
     *
     * @param offset    Start position
     * @param length    Number of elements to read
     */
    async getEntities(offset:number, length:number) {
        const entities = await this.data.orderBy(this.orderKey).offset(offset).limit(length).toArray();
        return entities.map(p=>this.decoder(p));
    }

    /**
     * Method used to process pending orders queue, it runs through the queue and sends any
     * item to remote storage server
     *
     * @param remoteProcessor   Remote processor for each one of the entity data
     */
    async processQueue(remoteProcessor:(p:ISynchronizationAction<T>)=>Promise<any>) {
        const errors = [];
        await this.transaction('rw',this.queue,this.data,async()=>{
            await this.queue.orderBy(':id').each(async q=>{
                const uri = q.uri;
                const action = q.action;
                const dataAction:ISynchronizationAction<any> = {action}

                if(action !== Action.DELETED) {
                    const localPerson = await this.data.where({uri}).first();
                    if (localPerson) {
                        dataAction.entity = localPerson;
                    }
                } else {
                    dataAction.entity = {uri}
                }
                if(dataAction.entity) {
                    try {
                        // Execute remote processing action
                        await remoteProcessor(dataAction);
                        // After processing we remove the entry from queue
                        await this.queue.delete(q.id);
                    }catch(e) {
                        errors.push(e);
                    }
                }
            });
        });
        if(errors.length!==0) {
            throw new Error()
        }
    }

    /**
     * Synchronize an external user from remote repository, it considers URI to verify whether exists a local user. If
     * the action is a DELETE one, it removes user from local repository
     *
     * @param p The action to synchronize
     */
    async syncExternalUser(p:ISynchronizationAction<T>) {
        // Find a user based on p uri
        if(!p.entity) return;
        await this.transaction('rw',this.data,async ()=>{
            const localEntity = await this.data.where({uri:p.entity!.uri}).first();
            if(!localEntity) {
                p.entity!.id = await this.data.add(p.entity!);
            } else {
                if(p.action === Action.DELETED) {
                    this.data.delete(localEntity.id!);
                } else {
                    this.data.update(localEntity.id!, p.entity!);
                }
            }
        })
    }

    /**
     * Get status of all system entities, this information could be used to check whether there are actual
     * changes or not
     */
    async getEntityStatus() {
        const entities = await this.data.orderBy('[timestamp+uri]').keys();

        return entities.map((e:IndexableTypePart)=>{
            const timestamp = Number((e as any)[0]);
            const uri =     (e as any)[1].toString();
            return {timestamp,uri} as IEntityStatus;
        })

    }

}