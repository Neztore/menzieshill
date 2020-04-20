// Created by josh on 16/04/2020
import React, {FunctionComponent, useState} from "react";
import CalendarEvent, {Repeat} from "../../../../shared/Types";
import {CancellationModal} from "./CancellationModal";
import {Api, showError} from '../../../../shared/util'
import CancellationList from "./CancellationList";

interface CancellationManagerProps {
	refresh: Function,
	event: CalendarEvent
}
/*
	Provides cancellation related components
	Fetches updated event on update and passes it up
	Stores the selected cancellation state.
	If it's not recurring, add is greyed out after 1 is added.
 */
export const CancellationManager: FunctionComponent<CancellationManagerProps> = ({event, refresh}) => {
	const [cancellation, setOpen] = useState();
	if (!event || !event.id || !event.cancellations) {
		return <p className="has-text-grey">Please save this event before adding cancellations.</p>
	}

	const isRecurring = event.repeat !== Repeat.None;
	const canAdd = isRecurring || event.cancellations.length === 0;
	async function handleDone(modified: boolean) {
		if (modified) {
			// Load new event from the API and pass it up
			if (event && event.id) {
				const ev = await Api.get(`/events/${event.id}`, {
					noCache: true
				});
				console.log("bb",ev.event)
				if (ev.error) {
					showError(ev.error);
				} else {
					if (ev.event) {
						refresh(ev.event);
					} else {
						showError("No event was supplied from refresh.")
					}
				}
			} else {
				return showError("Failed to reload event from server: ")
			}
		}
		setOpen(false);

	}
	if (cancellation) {
		return <CancellationModal cancellation={cancellation} handleDone={handleDone} event={event}/>
	}

	return <div>
		<div className="level">
			<div className="level-left">
				<div className="level-item">
					<Title event={event}/>
				</div>
			</div>
			<div className="level-right">
				<div className="level-item">
					<button className="button is-danger"  onClick={()=>setOpen(true)} disabled={!canAdd}>Add cancellation</button>
				</div>
			</div>
		</div>
		<CancellationList handleClick={setOpen} cancellations={event && event.cancellations} event={event}/>
	</div>
};
export default CancellationManager

const Title = ({event}: {event: CalendarEvent})=> (<p className="subtitle">
	{
		event.repeat === Repeat.None ?
			event.cancellations.length !== 0 ? "This event has been cancelled":"This event has not been cancelled"
			:
			(<span>This event has <code>{event.cancellations.length}</code> cancellations.</span>)
	}
</p>);