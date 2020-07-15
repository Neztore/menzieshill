// Created by josh on 15/04/2020
import React, {FunctionComponent} from "react";
import {Form, Formik} from "formik";
import {Api} from "../../../../shared/util";
import { showMessage, unescapeHtml } from '../../../../../../../public/js';
import {Dropdown, NormalInput, TextArea, Field} from "../../../../../bulma/Field";
import CalendarEvent, {EventColour, EventType, Repeat} from "../../../../shared/Types";
import DayPicker from "../../DayPicker";

interface EventFormProps {
	event: Partial<CalendarEvent>,
	refresh: Function
}
export const EventForm: FunctionComponent<EventFormProps> = (props) => {
	let {
		name = "",
		when = new Date,
		length = 1,
		description = "",
		colour = EventColour.White,
		type = EventType.Global,
		repeat = Repeat.None
	} = props.event||{};
	if (description === null) {
	    description = ""
    }
	if (typeof when === "string") {
		when = new Date(when)
	}
	let time: string = "";
	if (props.event) {
		const hours = `${when.getHours()}`.length === 2 ? `${when.getHours()}` : `0${when.getHours()}`;
		const minutes = `${when.getMinutes()}`.length === 2 ? `${when.getMinutes()}` : `0${when.getMinutes()}`;
		time = `${hours}:${minutes}`;
	}
		return <Formik
		enableReinitialize
		initialValues={{name, when, length, description: unescapeHtml(description), colour, type, repeat, time}}
		onSubmit={async (values, { setSubmitting, setErrors }) => {
			console.log(values);
			const postRequest = props.event.id ? Api.patch(`/events/${props.event.id}`, { body: values }) : Api.post(`/events`, {body: values});
			const res = await postRequest;
			if (res.error) {
				console.error(`${res.error.status}: ${res.error.message}`);
				setErrors({
					name: res.error.message
				});
				setSubmitting(false)
			} else {
				showMessage("Event updated", "Successfully applied your edits!", "success", 2000);
				props.refresh(res.event);
			}
		}}
		validate={(values)=>{
			const errors:any = {};
			if (values.name) {
				if (values.name.length > 100 || values.name.length < 3) {
					errors.name = "Name must be less than 100 characters and more than 3."
				}
			} else {
				errors.name = "A name is required."
			}
			if (values.time) {
				const [hours, minutes] = values.time.split(":");
				const parsedHours = parseInt(hours);
				const parsedMinutes = parseInt(minutes);
				if (parsedMinutes && parsedHours && !isNaN(parsedHours) && !isNaN(parsedMinutes)) {
					if (parsedMinutes < 0 || parsedMinutes >= 60) {
						errors.time = "Minutes must be between 0 and 60."
					} else if (parsedHours < 0 || parsedHours >= 24) {
						errors.time = "Hours must be between 0 and 24."
					} else {
						values.when.setHours(parsedHours);
						values.when.setMinutes(parsedMinutes);
					}
				} else {
					errors.time = "Invalid time: Please specify hours and minutes."
				}
			} else {
				errors.time = "You must specify a time."
			}

			// Check date
			if (!values.when || typeof values.when !== "object") {
				errors.date = "Invalid date";
			}

			//
			if (values.length) {
					if (values.length <=0 || values.length>168) {
						errors.length = "Events must last more than 0 hours and under 1 week."
					}
			} else {
				errors.length = "You must specify a length value in hours."
			}

			if (!EventColour[values.colour]) {
				errors.colour = "You must supply a valid colour option."
			}
			if (!Repeat[values.repeat]) {
				errors.repeat = "You must supply a valid repeat option."
			}
			if (!EventType[values.type]) {
				errors.type = "You must supply a valid type option."
			}

			if (values.description) {
				if (values.description.length > 100000) {
					errors.description = "What. More than 100 thousand characters? In an event? Why? no."
				}
			}

			return errors

		}}
	>
		{({ isSubmitting }) => (
				<Form>
					<Field>
						<NormalInput type="text" name="name" label="Event name"/>
					</Field>
					<Field grouped>
						<DayPicker name="when" label="Date (Y-M-D)"/>
						<div className="control">
							<NormalInput label="Start time" name="time" type="time"/>
						</div>
						<div className="control">
							<NormalInput type="number" name="length" label="Length (Hours)" min="1" max="168" step="1"/>
						</div>
					</Field>
					<Field>

					</Field>
					<Field grouped>
						<div className="control">
							<Dropdown label="Colour: " name="colour">
								<option>Turqoise</option>
								<option>Blue</option>
								<option value="LightGrey">Light Grey</option>
								<option>Red</option>
								<option>Yellow</option>
								<option>Green</option>
								<option>White</option>
								<option>Black</option>
							</Dropdown>
						</div>
						<div className="control">
							<Dropdown label="Type: " name="type">
								<option>Global</option>
								<option>Swimming</option>
								<option value="WaterPolo">Water Polo</option>
								<option value="OpenWater">Open Water</option>
							</Dropdown>
						</div>

						<div className="control">
							<Dropdown label="Repeat: " name="repeat">
								<option>None</option>
								<option>Daily</option>
								<option>Weekly</option>
								<option>Monthly</option>
							</Dropdown>
						</div>

					</Field>


					<Field>
						<TextArea name="description" label="Description" rows="5"/>
					</Field>

					<Field>
						<button type="submit" className={`button is-info ${isSubmitting && "is-loading"}`}>Submit</button>
					</Field>

				</Form>
		)}
	</Formik>

};
export default EventForm
