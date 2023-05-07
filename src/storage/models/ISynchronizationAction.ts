// Copyright (c) 2023. Divisa iT SAU

import {Action} from "./Action";
import {ISynchronizable} from "./ISynchronizable";

/**
 * Interface used to receive and send information from/to remote origin
 *
 * @author David Rodríguez Alfayate
 */
export interface ISynchronizationAction<T extends ISynchronizable> {
    /**
     * Action type
     */
    action: Action;

    /**
     * Entity information
     */
    entity?: T;
}