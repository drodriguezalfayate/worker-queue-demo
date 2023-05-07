// Copyright (c) 2023. Divisa iT SAU

/**
 * This interface holds status of an entity in the system, that is for its universal identifier (uri), its last
 * change. Sending information as this to remote endpoint, allows to receive only the desired changes, not all
 * of the database (except if local database is empty)
 *
 * @author David Rodríguez Alfayaste
 */
export interface IEntityStatus {
    /**
     * Last change of entity in milliseconds from epoch
     */
    timestamp:number;

    /**
     * Entity universal resource identifier
     */
    uri:string;
}