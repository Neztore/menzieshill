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

export const DateTimePicker: FunctionComponent<DayPickerProps> = ({ name, small, label }) => {
  const [, meta, helpers] = useField(name);
  const { value, error } = meta;
  const { setValue } = helpers;
  function setTime (ev: any) {
    const values = ev.target.value;
    if (values && values !== "") {

    }
    const newDate = new Date(value.getTime());
    const [hours, minutes] = values.split(":");

    const parsedHours = parseInt(hours, 10);
    const parsedMinutes = parseInt(minutes, 10);
    // Normally we'd leave validation to Formik, but because this is custom we've got to do it.
    if (parsedHours >= 0 && parsedHours < 24 && parsedMinutes >= 0 && parsedMinutes < 59) {
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      setValue(newDate);
    }
  }

  return (
    <div className="field is-grouped">
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
				  :						""
			}

      </div>
      <div className="control">
        <input type="time" className="input" required pattern="[0-9]{2}:[0-9]{2}" name="time" value={`${value.getHours()}:${value.getMinutes()}`} onChange={setTime} />
      </div>
    </div>
  );
};
export default DateTimePicker;
