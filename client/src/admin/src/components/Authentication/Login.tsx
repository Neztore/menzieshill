import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";

import { Field, NormalInput } from "../../../bulma/Field";
import UserContext from "../../context/UserContext";
import { Api } from "../../shared/util";

export function Login () {
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
          password: ""
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          const { username, password } = values;
          const res = await Api.post("/users/login", {
            body: {
              username,
              password
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
            errors.username = "Required";
          } else if (values.username.length < 2) {
            errors.username = "Too short.";
          }
          if (values.password) {
            if (values.password.length < 8 || values.password.length > 50) {
              errors.password = "Invalid length - Must be more than 8 characters and less than 50.";
            }
          } else {
            errors.password = "Required";
          }

          return errors;
        }}>
        {({ isSubmitting }) => (
          <div className="columns">
            <div className="column is-one-third is-offset-one-third">
              <Form className="box">
                <h2 className="is-size-2 has-text-centered">Login</h2>
                <p>Use this form to login to your existing account. You can use either your username or your email to login.</p>
                { user ? <p className="has-text-danger has-text-centered">Warning: You are currently logged in. <Link to="/"> Open the dashboard.</Link></p> : ""}
                <Field>
                  <NormalInput type="text" name="username" label="Username" />
                </Field>
                <Field>
                  <NormalInput type="password" name="password" label="Password" />
                </Field>
                <button type="submit" className={`is-info button ${isSubmitting ? "is-loading" : ""}`}>Submit</button>
              </Form>
              <p className="has-text-centered">
                <Link to="register">Create an account</Link>
              </p>
            </div>

          </div>

        )}
      </Formik>
    </div>
  );
}
export default Login;
