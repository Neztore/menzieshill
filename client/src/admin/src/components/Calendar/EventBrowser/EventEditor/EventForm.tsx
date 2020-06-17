// Created by josh on 15/04/2020
import React, {FunctionComponent} from "react";
import {Form, Formik} from "formik";
import {Api} from "../../../../shared/util";
import { showMessage, unescapeHtml } from '../../../../../../../public/js';
import {Dropdown, NormalInput, TextArea, Field} from "../../../../../bulma/Field";
import CalendarEvent, {EventColour, EventType, Repeat} from "../../../../shared/Types";

interface EventFormProps {
	event: Partial<CalendarEvent>,
	refresh: Function
}

export const EventForm: FunctionComponent<EventFormProps> = (props) => {
	let {
		name = "",
		when = new Date(),
		length = 1,
		description = "",
		colour = EventColour.White,
		type = EventType.Global,
		repeat = Repeat.None
	} = props.event||{};
	if (description === null) {
	    description = ""
    }
	return <Formik
		enableReinitialize
		initialValues={{name, when, length, description: unescapeHtml(description), colour, type, repeat}}
		onSubmit={async (values, { setSubmitting, setErrors }) => {
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

			// Check date

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

					{ /* WHEN FIELD   */}
					<Field>
						<NormalInput type="number" name="length" label="Length (Hours)" min="1" max="168" step="1"/>
					</Field>
					<Field grouped>
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
						<Dropdown label="Type: " name="type">
							<option>Global</option>
							<option>Swimming</option>
							<option value="WaterPolo">Water Polo</option>
							<option value="OpenWater">Open Water</option>
						</Dropdown>
						<Dropdown label="Repeat: " name="repeat">
							<option>None</option>
							<option>Daily</option>
							<option>Weekly</option>
							<option>Monthly</option>
						</Dropdown>
					</Field>


					<Field>
						<TextArea name="description" label="Description" rows="5"/>
					</Field>

					<Field>
						<div className = "buttons is-multiple">
							<button type="submit" className={`button is-info ${isSubmitting && "is-loading"}`}>Submit</button>
							<button className={`button is-danger ${isSubmitting && "is-loading"}`}>Delete</button>
						</div>

					</Field>

				</Form>
		)}
	</Formik>

};
export default EventForm
