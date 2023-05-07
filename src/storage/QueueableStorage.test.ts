import "fake-indexeddb/auto";
import fakeIndexedDB from "fake-indexeddb";

import {QueueableStorage} from "./QueueableStorage";
import {Action} from "./models/Action";
import {ISynchronizable} from "./models/ISynchronizable";

class LocalPerson implements ISynchronizable{
    /**
     * User id
     */
    id?:number;

    /**
     * User uri (universal resource identifier)
     */
    uri?:string;

    /**
     * User name
     */
    name?: string;

    /**
     * User surname
     */
    surname?: string;

    constructor({uri,id,name,surname}: { uri?:string,id?:number,name?:string,surname?:string }) {
        this.uri = uri;
        this.id = id;
        this.name = name;
        this.surname = surname;
    }

    /**
     * Returns user fullname, built from name and surname
     */
    get fullname() {
        if(this.name && this.surname) {
            return `${this.name} ${this.surname}`;
        }
        if(this.name) return this.name;
        return this.surname;
    }

    /**
     * Returns user acronym. User acronym is composed of two letters. In a normal situation the first one is
     * obtained from name and the second one from surname, in those cases where surname or name doesn't exist
     * both characters are recovered from the valid on.
     */
    get acronym() {
        if(this.name && this.surname) {
            return `${this.name.charAt(0)}${this.surname.charAt(0)}`.toUpperCase();
        }
        const source = (this.name || this.surname || '').toUpperCase();
        if(!source) return undefined;
        return source.substring(0,2);
    }


    /**
     * Static method to create Person from an array of raw JSON data.
     *
     * @param input array of raw JSON data
     */
    static decode(input:[]) {
        return input.map(i=>new LocalPerson(i));
    }
}


beforeEach(()=>{
    fakeIndexedDB.deleteDatabase('worker-demo-db');
})

test('Check addind,updating, deleting user',async ()=>{
    const storage = new QueueableStorage<LocalPerson>(input => new LocalPerson(input));

    const p = new LocalPerson({uri:'abc',name:'Joan',surname:'Mary'});
    await storage.createEntity(p);
    expect(p.uri).not.toBeNull();
    expect(p.uri).not.toBeUndefined();

    expect(p.id).not.toBeNull();
    expect(p.id).not.toBeUndefined();
    const users = await storage.getEntities(0,1000);
    expect(users).not.toBeNull();
    expect(users).not.toBeUndefined();
    expect(users.length).toBe(1);
    expect(users[0].acronym).toBe('JM');

    // We hope that the new user must have been created in the queue, so we expect to have a CREATE action
    let inLoop = false;
    await storage.processQueue(p=>{
        expect(p.action).toBe(Action.CREATED);
        inLoop = true;
        return Promise.resolve();

    });
    expect(inLoop).toBe(true);
    inLoop = false;
    p.name = 'Louis';
    // Updating must have only PATCHED register, because the CREATE one should have been deleted previously
    await storage.updateEntity(p);
    await storage.processQueue(p=>{
        expect(p.action).toBe(Action.PATCHED);
        inLoop = true;
        return Promise.resolve();
    });
    expect(inLoop).toBe(true);
    // We are going to perform two actions, first one is an update and afterwards a DELETE one, but
    // the queue should only contain the DELETE action.
    p.name = 'Joanna';
    inLoop = false;
    await storage.updateEntity(p);
    await storage.deleteUser(p);
    await storage.processQueue(p=>{
        expect(p.action).toBe(Action.DELETED);
        inLoop = true;
        return Promise.resolve();
    });

    expect(inLoop).toBe(true);
    inLoop = false;
    await storage.processQueue(p=>{
        return Promise.resolve();
        inLoop = true;
    });
    expect(inLoop).toBe(false);

    // Finally, we are going to perform a create and an update operation, we should have two entries
    // in queue, being the last one the patching action.
    let first = true;
    const novelPerson = new LocalPerson({uri:'abc',name:'Joan',surname:'Mary'});
    await storage.createEntity(novelPerson);
    novelPerson.name='Louis';
    await storage.updateEntity(novelPerson);
    let actions = 0;
    await storage.processQueue(p=>{
        expect(p.action).toBe(first?Action.CREATED:Action.PATCHED);
        first = false;
        actions++;
        return Promise.resolve();

    });
    expect(first).toBe(false);
    expect(actions).toBe(2);
})

test('Checking synchronization queue, it shouldn not create entries',async  ()=>{
    const storage = new QueueableStorage<LocalPerson>(input => new LocalPerson(input));

    const p = new LocalPerson({uri:'abc',name:'Joan',surname:'Mary'});
    await  storage.syncExternalUser({action:Action.CREATED,entity:p});
    // User must not be created in queue, because it's an external update
    let inLoop = false;
    await storage.processQueue(p=>{
        return Promise.resolve();
        inLoop = true;
    });
    expect(inLoop).toBe(false);
    let users = await storage.getEntities(0,1000);
    expect(users).not.toBeNull();
    expect(users).not.toBeUndefined();
    expect(users.length).toBe(1);
    await  storage.syncExternalUser({action:Action.DELETED,entity:p});
    users = await storage.getEntities(0,1000);
    expect(users).not.toBeNull();
    expect(users).not.toBeUndefined();
    expect(users.length).toBe(0);

})

test('Checking entries to sync',async ()=>{
    const storage = new QueueableStorage<LocalPerson>(input => new LocalPerson(input));

    const p = new LocalPerson({uri:'abc',name:'Joan',surname:'Mary'});
    await  storage.syncExternalUser({action:Action.CREATED,entity:p});
    const p2 = new LocalPerson({uri:'cde',name:'Joanna',surname:'Marya'});
    await  storage.syncExternalUser({action:Action.CREATED,entity:p2});

    const changes = await storage.getEntityStatus();
    expect(changes).not.toBeNull();
    expect(changes).not.toBeUndefined();
    expect(changes.length).toBe(2);
    expect(changes[0].timestamp).not.toBeUndefined();
    expect(changes[0].timestamp).not.toBeNull();

    expect(changes[1].timestamp).not.toBeUndefined();
    expect(changes[1].timestamp).not.toBeNull();

    expect(changes[0].uri).not.toBeUndefined();
    expect(changes[0].uri).not.toBeNull();

    expect(changes[1].uri).not.toBeUndefined();
    expect(changes[1].uri).not.toBeNull();

    expect(changes[0].uri).not.toBe(changes[1].uri);
})