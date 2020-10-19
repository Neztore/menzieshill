import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import {
  Checkbox, Field, HorizontalMultipleField, NormalInput
} from "../../../bulma/Field";
import UserContext from "../../context/UserContext";
import { Api } from "../../shared/util";

export function Register () {
  const [redirect, setRedirect] = useState<boolean>(false);
  if (redirect) {
    return <Redirect to="/" />;
  }
  const user = useContext(UserContext);
  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
          email: "",
          termsAgreed: false,
          firstName: "",
          lastName: ""
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          const {
            username, password, email, firstName, lastName
          } = values;
          const res = await Api.post("/users/register", {
            body: {
              username,
              password,
              email,
              firstName,
              lastName
            }
          });
          if (res.error) {
            const errors:any = {};
            if (!res.error.errors) {
              // what
              errors.username = res.error.message;
            } else {
              for (const error of res.error.errors) {
                errors[error.field] = error.msg;
              }
            }
            setErrors(errors);
          } else {
            setRedirect(true);
          }

          setSubmitting(false);
        }}
        validate={values => {
          const errors:any = {};
          if (!values.username) {
            errors.username = "A username is required.";
          } else if (values.username.length < 2) {
            errors.username = "Too short.";
          }
          if (!values.email) {
            errors.email = "A valid email address is required.";
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = "Invalid email address";
          }
          if (!values.termsAgreed) {
            errors.termsAgreed = "You must agree to our terms to continue";
          }
          if (values.password) {
            if (values.password.length < 8 || values.password.length > 50) {
              errors.password = "Invalid length - Must be more than 8 characters and less than 50.";
            }
          } else {
            errors.password = "Required";
          }
          if (values.confirmPassword) {
            if (values.confirmPassword.length < 8 || values.confirmPassword.length > 50) {
              errors.confirmPassword = "Invalid length - Must be more than 8 characters and less than 50.";
            }
          } else {
            errors.confirmPassword = "Required";
          }
          if (values.password !== values.confirmPassword && !errors.confirmPassword) {
            errors.confirmPassword = "Passwords must match.";
          }
          if (!values.firstName) {
            errors.firstName = "Required";
          } else if (values.firstName.length < 2) {
            errors.firstName = "Too short.";
          }
          if (!values.lastName) {
            errors.lastName = "Required";
          } else if (values.lastName.length < 2) {
            errors.lastName = "Too short.";
          }

          return errors;
        }}>
        {({ isSubmitting }) => (
          <div className="columns">
            <div className="column is-one-third is-offset-one-third">
              <Form className="box">
                <h2 className="is-size-2 has-text-centered">Register</h2>
                <p>Fill out this form to create an account on our website, which is useful for keeping up to date.</p>
                { user ? <p className="has-text-danger has-text-centered">Warning: You are currently logged in. <Link to="/"> Open the dashboard.</Link></p> : ""}
                <HorizontalMultipleField
                  label="Name: "
                  fields={[
                    {
                      name: "firstName",
                      placeholder: "First name"
                    },
                    {
                      name: "lastName",
                      placeholder: "Last name"
                    }]} />
                <Field>
                  <NormalInput type="email" name="email" label="Email address" small="This is public and must be unique - no other account can use it." />
                </Field>
                <Field>
                  <NormalInput type="password" name="password" label="Password" small="Must be between 8 and 50 characters." />
                </Field>
                <Field>
                  <NormalInput type="password" name="confirmPassword" label="Confirm password" placeholder="Type your password again!" />
                </Field>
                <Field>
                  <NormalInput type="text" name="username" label="Username" />
                </Field>
                <Field>
                  <Checkbox name="termsAgreed"> Agree to the <a href="https://menzieshillwhitehall.co.uk/privacy">privacy policy.</a></Checkbox>
                </Field>
                <button type="submit" className={`is-info button ${isSubmitting ? "is-loading" : ""}`}>Submit</button>
              </Form>
              <p className="has-text-centered">
                <Link to="login">Have an account? Login.</Link>
              </p>
            </div>

          </div>

        )}
      </Formik>
    </div>
  );
}
export default Register;
