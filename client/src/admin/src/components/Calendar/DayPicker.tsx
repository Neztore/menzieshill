// Created by josh on 18/04/2020
// Exports a Formik compatible wrapper component around a daypicker input.
import React, { FunctionComponent } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { useField } from "formik";

interface DayPickerProps {
	name: string,
	small?:string,
	label: string
}

export const DayPicker: FunctionComponent<DayPickerProps> = ({ name, small, label }) => {
  const [, meta, helpers] = useField(name);
  const { value, error } = meta;
  const { setValue } = helpers;
  return (
    <div className="control">
      <label className="label">{label}</label>
      <DayPickerInput onDayChange={setValue} value={value} inputProps={{ className: "input" }} placeholder="Input date" />
      {small ? <p className="help">{small}</p> : ""}
      {
			error
			  ? (
  <p className="help is-danger">
    {error}
  </p>
			  )
			  :				""
		}

    </div>
  );
};
export default DayPicker;
