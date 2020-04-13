// Created by josh on 11/04/2020
// Displays either an event if one is selected, or the text "No event selected"
import React, {FunctionComponent} from "react";
import CalendarEvent from "../../../../shared/Types";

interface EventEditorProps {
	selectedEvent: CalendarEvent
}

export const EventEditor: FunctionComponent<EventEditorProps> = ({selectedEvent}) => {
	if (selectedEvent) {
		return <div>
			<p className="has-text-centered">Selected event: {selectedEvent.name}</p>
		</div>
	} else {
		return <div>
			<p className="has-text-centered has-text-grey">No event selected</p>
		</div>
	}
};
export default EventEditor