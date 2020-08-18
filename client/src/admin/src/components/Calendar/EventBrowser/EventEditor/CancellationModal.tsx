// Created by josh on 17/04/2020

import { Form, Formik } from "formik";
import React, { FunctionComponent } from "react";

import { EditModal } from "../../../../../bulma/EditModal";
import { Field, TextArea } from "../../../../../bulma/Field";
import CalendarEvent, { Cancellation, Repeat } from "../../../../shared/Types";
import { Api, unescape } from "../../../../shared/util";
import DayPicker from "../../DayPicker";

interface CancellationModalProps {
	cancellation: Partial<Cancellation>,
	handleDone: Function,
	event: Partial<CalendarEvent>
}

export const CancellationModal: FunctionComponent<CancellationModalProps> = ({ cancellation, handleDone, event }) => {
  let {
    id,
    when = new Date(),
    reason = ""

  } = cancellation;
  // IDE doesn't like this, but it's right. Fuck you Webstorm.
  if (typeof when === "string") {
    when = new Date(when);
  }
  if (reason) {
    reason = unescape(reason);
  }
  async function deleteCancellation () {
    const confirmation = confirm("Are you sure you want to delete this cancellation?");
    if (!confirmation) return;
    // Delete it
    if (id && event.id) {
      const resp = await Api.delete(`/events/${event.id}/cancel/${id}`);
      if (resp.error) {
        throw new Error(resp.error.message);
      } else {
        handleDone(false);
      }
    }
    handleDone(true);
  }
  const isRecurring = event && event.repeat !== Repeat.None;
  const initial: {
		reason: string,
		when?: Date
	} = { reason };
  if (isRecurring) {
    initial.when = when;
  }
  return (
    <Formik
      initialValues={initial}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
		  if (!event.id) {
		    // Shouldn't get here
		    throw new Error("You must save the event before adding cancellations.");
		  }
		  const postRequest = id ? Api.patch(`/events/${event.id}/cancel/${id}`, { body: values }) : Api.post(`/events/${event.id}/cancel`, {
		    noCache: true,
		    body: values
		  });
		  const res = await postRequest;
		  if (res.error) {
		    console.error(`${res.error.status}: ${res.error.message}`);
		    setErrors({ reason: res.error.message });
		    setSubmitting(false);
		  } else {
		    handleDone(true);
		  }
      }}
      validate={values => {
		  const errors:any = {};

		  if (values.reason) {
		    if (values.reason.length > 10000) {
		      errors.content = "What. More than 10 thousand characters? In a reason? Why? no.";
		    } else if (values.reason.length < 2) {
		      errors.content = "Reason must be more than 2 characters.";
		    }
		  } else {
		    errors.content = "Reason is required.";
		  }

		  return errors;
      }}>
      {({ isSubmitting, handleSubmit }) => (
        <EditModal delete={deleteCancellation} close={() => handleDone(false)} save={handleSubmit} isSubmitting={isSubmitting} title={cancellation && cancellation.id ? `Editing cancellation` : "Add cancellation"}>
          <Form id="cancellation-form">
            {isRecurring ? <DateField /> : ""}
            <Field>
              <TextArea rows="5" name="reason" label="Reason for cancellation" />
            </Field>
          </Form>
        </EditModal>
      )}
    </Formik>
  );
};
export default CancellationModal;

const DateField = ({}) => (
  <Field>
    <DayPicker name="when" label="Date of cancellation" />

  </Field>
);
