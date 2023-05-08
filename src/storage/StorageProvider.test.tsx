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