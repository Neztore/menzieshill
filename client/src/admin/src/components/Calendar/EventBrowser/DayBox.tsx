// Created by josh on 12/04/2020
// Contains the events on a given day.
import React, {FunctionComponent} from "react";
import CalendarEvent from "../../../shared/Types";
import EventItem from "./EventItem";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];

interface DayBoxProps {
	events: CalendarEvent[],
	date: Date,
	setSelected: Function,
	selectedEvent: CalendarEvent,
	selected: boolean
}

export const DayBox: FunctionComponent<DayBoxProps> = ({date, events, setSelected, selectedEvent,selected}) => {
	return <div className="daybox">
		<h3 className="daybox-heading has-text-weight-semibold is-capitalized">{days[date.getDay()]} {date.getDate()}</h3>
		<div className="daybox-content">
			{
				events.map((e)=> <EventItem selected={selected && selectedEvent.id === e.id} event={e} handleClick={setSelected} key={Math.random()}/>)
			}
		</div>

	</div>
};
export default DayBox