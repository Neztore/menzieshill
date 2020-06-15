// Created by josh on 09/06/2020
import React, {FunctionComponent} from "react";
import {Api} from "../../shared/util";
import EditModal from "../../../bulma/EditModal";
import {Form, Formik} from "formik";
import {HorizontalField, HorizontalMultipleField} from "../../../bulma/Field";
import GroupEditor from "../Users/ModifyUser/GroupEditor";
import {User} from "../../shared/Types";

interface AccountFormProps {
	editMade: Function,
	user: User
}

export const AccountForm: FunctionComponent<AccountFormProps> = (props) => {
	const {username, firstName, lastName, email} = props.user;
	return <Formik
		initialValues={{username: username || "", firstName: firstName || "", lastName: lastName || "", email: email || "", password:"", confirmPassword: ""}}
		onSubmit={async (values, { setSubmitting, setErrors }) => {
			const res = await Api.patch(`/users/@me`, {body: values});
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
				props.editMade(res.user)
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
					<h2 className="subtitle">Password management</h2>
					<HorizontalField type="text" name="oldPassword" label="Current password:" small="Only needed if updating your password. If you do not know it, contact admin@menzieshillwhitehall.co.uk."/>
					<HorizontalField type="text" name="password" label="New Password:" small="Leave blank - Only provide a value if you want to change it."/>
					<HorizontalField type="text" name="password" label="Confirm new Password:" small="Same as above."/>
					<button type="submit" className={`is-success button is-fullwidth ${isSubmitting ? "is-loading":""}`} onClick={()=>handleSubmit}>Submit</button>
				</Form>
		)}
	</Formik>
};
export default AccountForm
