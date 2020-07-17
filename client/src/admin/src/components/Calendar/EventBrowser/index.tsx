// Created by josh on 06/04/2020
import React, {FunctionComponent, useEffect, useState} from "react";
import EventEditor from "./EventEditor";
import EventList from "./EventList";
import CalendarEvent, {HttpError, Repeat} from "../../../shared/Types";
import * as Api from "../../../../../../public/js/apiFetch";
import Notification from "../../../../bulma/notification";

interface EventBrowserProps {
	filterNo: number,
	displayDate: Date
	selectedId?: number,
	setSelectedId: Function
}
export interface EventsResponse {
	success: boolean,
	recurring: CalendarEvent[],
	events: CalendarEvent[],
}
// Handles state and fetching events
export const EventBrowser: FunctionComponent<EventBrowserProps> = ({filterNo, displayDate, selectedId, setSelectedId}) => {
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

	function updateEvent(eventInfo?: CalendarEvent, isDeletion?: boolean):any {
		if (!eventInfo) {
			return setSelectedId(undefined);
		}
		if (events) {
			const arrStr = eventInfo.repeat === Repeat.None ? "events" : "recurring";
			if (events[arrStr] && events[arrStr].length > 0) {
				const outArr = [...events[arrStr]];
				let updated = false;
				for (let i=0; i<outArr.length; i++) {
					if (outArr[i].id === eventInfo.id) {
						if (isDeletion) {
							outArr.splice(i, 1);
							updated = true;
							setSelectedId(undefined);
							break;
						} else {
							if (!eventInfo.cancellations) {
								// The Edit API does not return cancellations. For ease, we just merge the old one if a new one isn't provided
								const cancellations = outArr[i].cancellations;
								// It will be
								if (cancellations) {
									eventInfo.cancellations = [...cancellations]
								}

							}
							outArr[i] = eventInfo;
							updated = true;
							break;
						}

					}
				}
				// Failed to find it.. It's probably new
				if (!updated) {
					outArr.push(eventInfo)
				}
				const newEvents = {...events};
				newEvents[arrStr] = outArr;
				setEvents(newEvents);

			}
		}
		if (!isDeletion) {
			setSelectedId(eventInfo.id);
		}

	}

	function getEvent(id: number):CalendarEvent|undefined {
		if (!events) return undefined;
		const recurring = checkForItem("recurring");
		if (recurring) {
			return recurring
		} else {
			return checkForItem("events");
		}
		function checkForItem(arrStr:"recurring"|"events") {
			if (!events) return undefined;
			if (events[arrStr] && events[arrStr].length > 0) {
				for (let i=0; i<events[arrStr].length; i++) {
					if (events[arrStr][i].id === id) {
						return events[arrStr][i];
					}
				}
				// not found
				return undefined;
			}
		}
	}
	if (err) {
		return <Notification>
			<h2 className="title">Oops, failed to get events for month range.</h2>
			<p><code>{err.status}</code>: {err.message}</p>
		</Notification>
	}
	if (events) {
		let sel;
		if (selectedId) {
			sel = getEvent(selectedId);
			if (!sel && selectedId) {
				// wont happen
				setSelectedId(undefined);
				return <p>Loading...</p>
			}
		}
		return <div className="columns">
			<div className="column is-4">
				<EventList filterNo={filterNo} setSelected={(e:CalendarEvent)=>setSelectedId(e.id)} selectedEvent={sel} events={events.events} recurringEvents={events.recurring} displayDate={displayDate}/>
			</div>
			<div className="column">
				{selectedId === undefined ?
                    <p className="has-text-centered has-text-grey">No event selected.</p>
					:
					<EventEditor selectedEvent={sel||{}} refresh={updateEvent}/>}
			</div>
		</div>
	} else {
		return <p className="has-text-centered">Loading...</p>
	}


};
export default EventBrowser
