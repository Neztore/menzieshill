// Created by josh on 06/04/2020
import React, {FunctionComponent, useEffect, useState} from "react";
import EventEditor from "./EventEditor";
import EventList from "./EventList";
import CalendarEvent, {HttpError} from "../../../shared/Types";
import * as Api from "../../../../../js/apiFetch";
import Notification from "../../../../bulma/notification";

interface EventBrowserProps {
	filterNo: number,
	displayDate: Date
}
export interface EventsResponse {
	success: boolean,
	recurring: CalendarEvent[],
	events: CalendarEvent[]
}
// Handles state and fetching events
export const EventBrowser: FunctionComponent<EventBrowserProps> = ({filterNo, displayDate}) => {
	const [selectedEvent, setSelected] = useState();
	const [err, setError] = useState<HttpError["error"]>();
	const [events, setEvents] = useState<EventsResponse>();

	useEffect(() => {
		(async function() {
			const start = new Date(displayDate.getFullYear(), displayDate.getMonth());
			const end = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
			const eventResp : EventsResponse|HttpError = await Api.getEvents(start,end);
			if ("error" in eventResp) {
				setError(eventResp.error);
			} else {
				setEvents(eventResp);
			}
		})()
	},  [displayDate]);
	if (err) {
		return <Notification>
			<h2 className="title">Oops, failed to get events for month range.</h2>
			<p><code>{err.status}</code>: {err.message}</p>
		</Notification>
	}
	if (events) {
		return <div className="columns">
			<div className="column is-4">
				<EventList filterNo={filterNo} setSelected={setSelected} selectedEvent={selectedEvent} events={events.events} recurringEvents={events.recurring} displayDate={displayDate}/>
			</div>
			<div className="column">
				<EventEditor selectedEvent={selectedEvent}/>
			</div>
		</div>
	} else {
		return <p>Loading...</p>
	}


};
export default EventBrowser