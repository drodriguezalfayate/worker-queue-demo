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