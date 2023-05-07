import {Person} from "./models/Person";
import {Table} from "reactstrap";
import React from "react";

/**
 * This view component is used to show different registered users and possible actions
 *
 * @param people        Array of people to show
 * @param onDelete      Action to delete user
 * @param onEdit        Action to edit a user
 * @param onCreate      Action to create a user
 *
 * @author David Rodríguez Alfayate
 */
export function ListView({people,onDelete,onEdit,onCreate}:
                         {people:Person[]|undefined,onDelete:(person:Person)=>void,onEdit:(person:Person)=>void,onCreate:()=>void}) {
    return <div className="people">
            {people && people.length>0?<Table>
                        <thead>
                            <tr>
                                <th>Acronym</th>
                                <th>Full name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {people.map(p=><tr key={p.id!}>
                                            <td>
                                                {p.acronym}
                                            </td>
                                            <td>
                                                {p.fullname}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" onClick={()=>onEdit(p)}>Edit</button>&nbsp;
                                                <button className="btn btn-secondary" onClick={()=>onDelete(p)}>Delete</button>
                                            </td>
                                       </tr>)}
                        </tbody>
                    </Table>:<></>}
            <div className="mt-2">
            <button onClick={onCreate}
                    className="btn btn-primary">Create new user</button>
            </div>
           </div>
}