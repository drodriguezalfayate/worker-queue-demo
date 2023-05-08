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


import {ISynchronizable} from "../../storage/models/ISynchronizable";

/**
 * Simple typescript class, maintains a person comprised of id, name and surname
 *
 * @author David Rodríguez Alfayate (drodriguez@divisait.com)
 */
export class Person implements ISynchronizable{
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


    constructor({uri,id,name,surname}: { uri?:string,id?:number,name?:string,surname?:string}) {
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
        return input.map(i=>new Person(i));
    }
}