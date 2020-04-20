// Created by josh on 11/04/2020
import React, {FunctionComponent} from "react";
import CalendarEvent, {Repeat} from "../../../shared/Types";
import Icon from "../../../../bulma/Icon";

interface EventItemProps {
	handleClick: Function,
	event: CalendarEvent,
	selected: boolean
}

export const EventItem: FunctionComponent<EventItemProps> = ({event: calEvent, handleClick, selected}) => {
	const { name, when, length } = calEvent;
	const d = new Date(when);
	const endDate = new Date(d.getTime());
	endDate.setHours(d.getHours() + length);

	// Pads it out to 2 characters
	function addZeros(number: number) {
		const str = `${number}`;
		return str.length > 1 ? str : `0${str}`;
	}
	const timeStr = (d: Date)=>`${addZeros(d.getHours())}:${addZeros(d.getMinutes())}`;
	function isCancelled(): boolean {
		if (calEvent.repeat === Repeat.None && calEvent.cancellations.length !==0) return true;
		for (let counter =0; counter<calEvent.cancellations.length; counter++) {
			const curr = calEvent.cancellations[counter];
			if (!curr.when) return true;
			const d = new Date(curr.when);
			const tar = new Date(calEvent.when);
			if (d.getDate() === tar.getDate() && d.getMonth() === tar.getMonth() && d.getFullYear() === tar.getFullYear()) {
				return true
			}
		}
		return false;
	}


	const cancelled = isCancelled();
	return <div className="event" onClick={()=> handleClick(calEvent)}>
		<article className="media">
			<figure className={`media-left ${selected ? `has-text-link`:""}`}>
						<Icon iconString={`fas event-icon ${calEvent.repeat === Repeat.None ? "fa-calendar-day": "fa-calendar-alt"} ${cancelled ? "has-text-danger":""}`}/>

			</figure>
			<div className="media-content">
				<div className="content">
					<p>
						<strong>{name}</strong>
						<br/>
						<small>{timeStr(d)} - {timeStr(endDate)}</small>
					</p>
				</div>
			</div>
		</article>
	</div>;
};
export default EventItem