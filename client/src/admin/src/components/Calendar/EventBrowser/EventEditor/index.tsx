// Created by josh on 11/04/2020
// Displays either an event if one is selected, or the text "No event selected"
import React, {FunctionComponent} from "react";
import CalendarEvent from "../../../../shared/Types";
import EventForm from "./EventForm";
import CancellationManager from "./CancellationManager";

interface EventEditorProps {
	selectedEvent?: CalendarEvent,
	refresh: Function
}

export const EventEditor: FunctionComponent<EventEditorProps> = ({selectedEvent, refresh}) => {
	if (selectedEvent) {
		console.log(selectedEvent);
		return <div className="columns event-editor">
			<div className="column is-10">
				<EventForm event={selectedEvent} refresh={refresh}/>
					<hr/>
				{/*  Cancellations */}
				<CancellationManager event={selectedEvent} refresh={refresh}/>
			</div>
		</div>
	} else {
		return <div>
			<p className="has-text-centered has-text-grey">No event selected</p>
		</div>
	}
};
export default EventEditor