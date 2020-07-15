// Created by josh on 11/04/2020
// Displays either an event if one is selected, or the text "No event selected"
import React, {FunctionComponent} from "react";
import CalendarEvent from "../../../../shared/Types";
import EventForm from "./EventForm";
import CancellationManager from "./CancellationManager";
import {Api} from "../../../../shared/util";

interface EventEditorProps {
	selectedEvent: Partial<CalendarEvent>,
	refresh: Function
}

export const EventEditor: FunctionComponent<EventEditorProps> = ({selectedEvent, refresh}) => {
	async function deleteEvent() {
		if (selectedEvent) {
			const confirmation = confirm("Are you sure you want to delete this event?");
			if (!confirmation) return;
			const resp = await Api.delete(`/events/${selectedEvent.id}`);
			if (resp.error) {
				throw new Error(resp.error.message)
			} else {
				return refresh(selectedEvent, true);
			}
		}
		refresh()
	}

		return <div className="columns event-editor">
			<div className="column is-10">
				<EventForm event={selectedEvent} refresh={refresh}/>
				<p>Please note that cancelling is recommended over deleting events.</p>
					<button type="button" className="button is-danger mt-1" onClick={deleteEvent}>Delete event</button>

				<hr/>
				{/*  Cancellations - Only if not "new" event.*/}
				{selectedEvent ? <CancellationManager event={selectedEvent as CalendarEvent} refresh={refresh}/> : ""}

			</div>
		</div>

};
export default EventEditor
