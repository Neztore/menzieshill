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
	return <div className="event" onClick={()=> handleClick(calEvent)}>
		<article className="media">
			<figure className={`media-left ${selected ? `has-text-link`:""}`}>
						<Icon iconString={`fas event-icon ${calEvent.repeat === Repeat.None ? "fa-calendar-day": "fa-calendar-alt"}`}/>

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