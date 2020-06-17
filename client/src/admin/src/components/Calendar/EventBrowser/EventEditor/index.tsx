// Created by josh on 11/04/2020
// Displays either an event if one is selected, or the text "No event selected"
import React, {FunctionComponent} from "react";
import CalendarEvent from "../../../../shared/Types";
import EventForm from "./EventForm";
import CancellationManager from "./CancellationManager";

interface EventEditorProps {
	selectedEvent: Partial<CalendarEvent>,
	refresh: Function
}

export const EventEditor: FunctionComponent<EventEditorProps> = ({selectedEvent, refresh}) => {
		return <div className="columns event-editor">
			<div className="column is-10">
				<EventForm event={selectedEvent} refresh={refresh}/>
				<hr/>
				{/*  Cancellations - Only if not "new" event.*/}
				{selectedEvent ? <CancellationManager event={selectedEvent as CalendarEvent} refresh={refresh}/> : ""}

			</div>
		</div>

};
export default EventEditor