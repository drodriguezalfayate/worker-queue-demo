import {IStorageAction} from "./IStorageAction";
import {useStorage} from "./useStorage";
import {StorageProvider} from "./StorageProvider";
import "fake-indexeddb/auto";
import {render,screen} from "@testing-library/react";
import {ISynchronizable} from "./models/ISynchronizable";

class Sample implements ISynchronizable {
    /**
     * Entity universal resource identifier, it should be unique across all clients and instances
     */
    uri?:string;

    /**
     * Local identifier, is a local database entity identifier, it's used just for storing and referencing
     * information about user
     */
    id?:number;

    constructor({uri,id}:{uri:string,id:number}) {
        this.uri = uri;
        this.id = id;

    }

}

function InnerElement() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const storage:IStorageAction<Sample>|undefined = useStorage<Sample>();
    expect(storage).not.toBeUndefined();
    expect(storage).not.toBeNull();
    expect(storage?.create).not.toBeUndefined();
    expect(storage?.create).not.toBeNull();


    return <div data-testid="demo">This is a demo</div>

}

test('Check StorageProvider and related hooks',async ()=>{
    render(<StorageProvider decoder={(data)=>new Sample(data)}>
                    <InnerElement/>
                  </StorageProvider>)

    expect(screen.queryByTestId('demo')).not.toBeUndefined();
    expect(screen.getByTestId('demo')).not.toBeNull();
})