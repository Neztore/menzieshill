import React, {FunctionComponent} from "react";
import {User} from "../../../shared/Types";
import EditModal from "../../../../bulma/EditModal";
import {NormalField, HorizontalField, HorizontalMultipleField, FormControl} from "../../../../bulma/Field";

import {Formik, Form, ErrorMessage} from "formik";
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
        email
    } = props.user;


    // Deal with form elements

    return <Formik
        initialValues={{username: username || "", firstName: firstName || "", lastName: lastName || "", email: email || ""}}
        onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
            }, 400);
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
                </Form>
                </EditModal>
            )}
        </Formik>


}
export default UserModal