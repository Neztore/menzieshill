import { ErrorMessage, Field as FormikField } from "formik";
import React, { Fragment, FunctionComponent } from "react";

interface baseProps{
    type?: string,
    colour?: string,
    placeholder?:string,
    name: string,
    small?: string
    min?: string
    max?: string
    step?: string
}

interface Props extends baseProps{
    label: string
}

// Text area
interface TextareaProps extends Props{
    rows: string
}
type FieldProps = {
    grouped?: boolean
}
export const Field:FunctionComponent<FieldProps> = ({ grouped, ...props }) => (
  <div className={`field ${grouped && "is-grouped"}`} {...props} />
);

const TextAreaInput = (props: Props) => (
  <textarea className={`textarea is-${props.colour}`} {...props} />);
const SelectInput = (props: Props) => (
  <div className={`select is-${props.colour}`}>
    <select {...props} />
  </div>
);

export const Dropdown:FunctionComponent<Props> = props => (
  <Fragment>
    <label className="label">{props.label}</label>
    <FormControl CustomInput={SelectInput} {...props} />
  </Fragment>
);

export const TextArea:FunctionComponent<TextareaProps> = props => (
  <Fragment>
    <label className="label">{props.label}</label>
    <FormControl CustomInput={TextAreaInput} {...props} />
  </Fragment>
);

const CheckboxInput = (props: Props) => (
  <div className="checkbox">
    <input type="checkbox" {...props} />
  </div>
);
export const Checkbox:FunctionComponent<Props> = props => (
  <Fragment>
    <label className="label">{props.label}</label>
    <FormControl CustomInput={CheckboxInput} {...props} />

  </Fragment>
);

export const NormalInput:FunctionComponent<Props> = props => (
  <Fragment>
    <label className="label">{props.label}</label>
    <FormControl {...props} />
  </Fragment>
);

export const HorizontalField:FunctionComponent<Props> = props => (
  <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">{props.label}</label>
    </div>
    <div className="field-body">
      <div className="field">
        <FormControl {...props} />
      </div>
    </div>

  </div>
);
interface MultipleProps {
    label: string,
    fields: baseProps[]
}
export const HorizontalMultipleField:FunctionComponent<MultipleProps> = props => (
  <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">{props.label}</label>
    </div>
    <div className="field-body">
      {
                props.fields.map(f => (
                  <div className="field" key={f.name}>
                    <FormControl {...f} />
                  </div>
                ))
            }
    </div>

  </div>
);

// These classes are used to interact with Formik.

// ErrorComponent is passed to the ErrorMessage so that the message gets appropriate CSS.
const ErrorComponent:FunctionComponent = props => (
  <p className="help is-danger">
    {props.children}
  </p>
);

// Applies to all form controls - encompasses both error and custom field

interface FormControlProps extends baseProps {
    CustomInput?: any
}

export const FormControl: FunctionComponent<FormControlProps> = props => {
  const passProps = { ...props };
  delete passProps.CustomInput;

  return (
    <div className="control">
      <FormikField as={props.CustomInput || CustomInput} name={props.name} {...passProps} />
      {props.small ? <p className="help">{props.small}</p> : ""}
      <ErrorMessage component={ErrorComponent} name={props.name} />
    </div>
  );
};

// Implements bulma formatting to Formik fields.
export const CustomInput = (props: Props) => (
  <input className={`input is-${props.colour}`} type={props.type || "text"} {...props} />);
