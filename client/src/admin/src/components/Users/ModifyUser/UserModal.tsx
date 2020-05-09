import React, {FunctionComponent} from "react";
import {User} from "../../../shared/Types";
import EditModal from "../../../../bulma/EditModal";
import {HorizontalField, HorizontalMultipleField} from "../../../../bulma/Field";
import { Api } from "../../../shared/util";

import {Formik, Form} from "formik";
import GroupEditor from "./GroupEditor";
// TODO: Need to intregate with the EditModal somehow if I want SaveChanges to connect.
// Possibly just a case of binding handleSubmit to the appropriate listener on Formik.

interface UserRowProps {
    user: User,
    handleDone: Function
}


export const UserModal:FunctionComponent<UserRowProps> = (props) => {
    const {
        username,
        firstName,
        lastName,
        groups,
        email,
        id
    } = props.user;


    // Deal with form elements

    return <Formik
        initialValues={{username: username || "", firstName: firstName || "", lastName: lastName || "", email: email || "", password:""}}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
           const res = await Api.patch(`/users/${id}`, {body: values});
            if (res.error) {
                const errors:any = {
                };
                if (!res.error.errors) {
                    // what
                    errors.username = res.error.message
                } else {
                    for (let error of res.error.errors) {
                        errors[error.field] = error.msg
                    }
                }
                setErrors(errors)
            } else {
                props.handleDone(res.user)
            }

           setSubmitting(false)
        }}
        validate={(values)=>{
            const errors:any = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.username) {
                errors.username = 'Required';
            } else if (values.username.length < 2) {
                errors.username = "Too short."
            }
            if (!values.firstName) {
                errors.firstName = 'Required';
            } else if (values.firstName.length < 2) {
                errors.firstName = "Too short."
            }
            if (!values.lastName) {
                errors.lastName = 'Required';
            } else if (values.lastName.length < 2) {
                errors.lastName = "Too short."
            }
            if (values.password) {
                if (values.password.length < 8 || values.password.length > 50) {
                    errors.password = "Invalid length - Must be more than 8 characters and less than 50."
                }
            }

            return errors

        }}
        >
            {({ isSubmitting, handleSubmit }) => (
                <EditModal close={()=>props.handleDone(false)} save={handleSubmit} isSubmitting={isSubmitting} title={`Editing ${username}`}>
                <Form>
                    <HorizontalField type="text" name="username" label="Username:"/>
                    <HorizontalMultipleField label="Name: " fields={[
                        {
                        name: "firstName",
                        placeholder: "First name"
                        },
                        {
                            name: "lastName",
                            placeholder: "Last name"
                        }]} />
                    <HorizontalField type="email" name="email" label="Email:"/>
                    <HorizontalField type="text" name="password" label="Password:" small="Leave blank - Only provide a value if you want to change it."/>
                    <GroupEditor groups={groups} userId={id}/>
                </Form>
                </EditModal>
            )}
        </Formik>


}
export default UserModal