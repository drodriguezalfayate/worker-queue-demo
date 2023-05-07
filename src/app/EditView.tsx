import {Person} from "./models/Person";
import {Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ChangeEvent, useState} from "react";

/**
 * This component view aim is to show a form that allows editing or creating a new user
 * in the system
 *
 * @param person        Current person data
 * @param onCancel      Cancel action
 * @param onAction      Save action
 *
 * @author David Rodríguez Alfayate
 */
export function EditView({person,onCancel,onAction}:{person?:Person,onCancel:()=>void,onAction:(person:Person)=>void}) {
    const [currentUser,setCurrentUser] = useState(()=>new Person(person||{}));

    // Function to change user name or surname, which are values who can
    // be introduced by system
    const changeData = (e:ChangeEvent<HTMLInputElement>)=>{
        const name = e.target.name as 'name'|'surname';
        const value = e.target.value;
        setCurrentUser((old)=>{
            const newPerson = new Person(old);
            newPerson[name] = value;
            return newPerson;
        })
    }

    // Submits and user to allow its creation
    const doSubmit = ()=>{
        if(currentUser.name && currentUser.surname) {
            onAction(currentUser);
        }
    }

    return <Modal isOpen onClosed={onCancel}>
                <ModalHeader>Create/Edit user</ModalHeader>
                <Form onSubmit={doSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <Label for={"name"}>
                                Name
                            </Label>
                            <Input name="name" id="name" onChange={changeData} value={currentUser.name||''} valid={!!currentUser.name} invalid={!currentUser.name}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for={"surname"}>
                                Surname
                            </Label>
                            <Input name="surname" id="surname" onChange={changeData} value={currentUser.surname||''} valid={!!currentUser.surname} invalid={!currentUser.surname}/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <button disabled={!currentUser.name || !currentUser.surname}
                                className="btn btn-primary"
                                type="submit">Save changes</button>
                    </ModalFooter>
                </Form>
           </Modal>
}