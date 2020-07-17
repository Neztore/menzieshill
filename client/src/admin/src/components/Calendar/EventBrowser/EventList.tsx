// Created by josh on 11/04/2020
import React, {FunctionComponent, useEffect, useState} from "react";
import CalendarEvent, {Repeat} from "../../../shared/Types";
import {FilterType} from "../Controller/Filter";
import DayBox from "./DayBox";



interface EventListProps {
	selectedEvent?: CalendarEvent,
	setSelected: Function,
	recurringEvents: CalendarEvent[],
	events: CalendarEvent[],
	filterNo: number,
	displayDate: Date
}
type List = CalendarEvent[][];
// Handles filtering and lists
export const EventList: FunctionComponent<EventListProps> = ({recurringEvents, events, filterNo, displayDate, setSelected, selectedEvent}) => {
	// Each number corresponds to day of the month - 1
	const [lists, setLists] = useState<List>([]);
	useEffect(function () {
		const arrOut: List = [];
		if (filterNo !== FilterType.recurring) {
			for (let event of events) {
				// Nice and simple :)
				const dateNo = new Date(event.when).getDate() -1;
				addEvent(dateNo, event);
			}
		}

		// Recurring events :/
		if ((filterNo === FilterType.all || filterNo ===FilterType.recurring) && recurringEvents[0]) {
			const targetMonth = displayDate.getDate(), targetYear = displayDate.getFullYear();
			const limit = daysInMonth(targetYear, targetMonth);

			for (let event of recurringEvents) {
				const date = new Date(event.when);
				if (event.repeat === Repeat.Daily) { // we always take. it's daily. Why would you use this? I have no idea.
					for (let i =0; i< limit; i++) {
						addEvent(i, event);
					}

				} else if (event.repeat === Repeat.Weekly) {
					let counter =0;
					let found = false;
					while (counter < limit) {
						const parsedCurrent = new Date(targetYear, targetMonth, counter + 1);
						if (parsedCurrent.getDay() === date.getDay()) {
							found = true;
							addEvent(counter, event);
						}

						if (found) {
							counter = counter + 7;
						} else {
							counter++
						}
					}

				} else if (event.repeat === Repeat.Monthly) {
					addEvent(date.getDate() -1, event);
				}
			}
		}

		setLists(arrOut);
		function addEvent(dateNo: number, event: CalendarEvent) {
			if (arrOut[dateNo]) {
				arrOut[dateNo].push(event);
			} else {
				arrOut[dateNo] = [event];
			}
		}
		return undefined;
	}, [filterNo,events, recurringEvents, displayDate ]);
	function setSelect(loc:number, e:CalendarEvent) {
			setSelected({
				_loc: loc,
				...e
			});

	}

	if (lists) {
			const rdy:JSX.Element[] = [];
			for (let i=0; i<lists.length; i++) {
				const current = lists[i];
				if (current && current.length !==0) {
					const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), i + 1);
					rdy.push(<DayBox events={current} date={date} key={i} setSelected={(e: CalendarEvent)=> setSelect(i, e)} selectedEvent={selectedEvent}/>)
				}

			}
			return <div className="event-list">
				{rdy}
			</div>;
	} else {
		return <p className="has-text-centered">Loading...</p>
	}
};
export default EventList
function daysInMonth (year: number, month: number) {
	// 0 wraps around to previous month. Hence, +1.
	return new Date(year, month + 1, 0).getDate();
}
