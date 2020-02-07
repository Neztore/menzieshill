import React, {FunctionComponent} from "react";
import {Field, ErrorMessage} from "formik";

interface baseProps{
    type?: string,
    colour?: string,
    placeholder?:string,
    name: string,
}

interface Props extends  baseProps{

    label: string
}



export const NormalField:FunctionComponent<Props> = (props) => {
    return <div className="field">
        <label className="label">{props.label}</label>
        <FormControl {...props} />
    </div>
};
export const HorizontalField:FunctionComponent<Props> = (props) => {
    return <div className="field is-horizontal">
        <div className="field-label is-normal">
            <label className="label">{props.label}</label>
        </div>
        <div className="field-body">
            <div className="field">
                <FormControl {...props}/>
            </div>
        </div>

    </div>;
};
interface MultipleProps {
    label: string,
    fields: baseProps[]
}
export const HorizontalMultipleField:FunctionComponent<MultipleProps> = (props) => {
    return <div className="field is-horizontal">
        <div className="field-label is-normal">
            <label className="label">{props.label}</label>
        </div>
        <div className="field-body">
            {
                props.fields.map((f)=>{
                    return <div className="field" key={f.name}>
                        <FormControl {...f}/>
                    </div>

                })
            }
        </div>

    </div>;
};


// These classes are used to interact with Formik.

// ErrorComponent is passed to the ErrorMessage so that the message gets appropriate CSS.
const ErrorComponent:FunctionComponent = (props) =>(
    <p className="help is-danger">
        {props.children}
</p>);

// Applies to all form controls - encompasses both error and custom field
export const FormControl: FunctionComponent<baseProps> = (props)=>(
    <div className="control">
        <Field  as={CustomInput} name={props.name} {...props}/>
        <ErrorMessage component={ErrorComponent} name={props.name}/>
    </div>
);

// Implements bulma formatting to Formik fields.
export const CustomInput = (props: Props)=> (
        <input className={`input is-${props.colour}`} type={props.type || "text"} {...props}/>);
export default Field