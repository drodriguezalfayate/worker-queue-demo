// Copyright (c) 2022 Divisa iT SAU

/**
 * This interface is just used to hold information related to objects which should be synchronizable between
 * local database system and remote provider.
 *
 * @author David Rodríguez Alfayate
 */
export interface ISynchronizable {
    /**
     * Entity universal resource identifier, it should be unique across all clients and instances
     */
    uri?:string;

    /**
     * Local identifier, is a local database entity identifier, it's used just for storing and referencing
     * information about user
     */
    id?:number;

}