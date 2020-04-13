// Created by josh on 05/04/2020
import React, {FunctionComponent} from "react";
import MonthSelector from "./MonthSelector";
import Filter from "./Filter";

interface ControllerProps {
	setFilter: Function,
	filterNo: number,
	displayDate: Date,
	setDate: Function
}

export const Controller: FunctionComponent<ControllerProps> = ({setFilter, filterNo, setDate, displayDate}) => {
	return <div className="level">
		<div className="level-left">
			<div className="level-item">
				<h1 className="title">Calendar</h1>

			</div>

		</div>
		<div className="level-item">
			<MonthSelector setDate={setDate} displayDate={displayDate}/>

		</div>
		<div className="level-right">
			<Filter filterType={filterNo} setFilter={setFilter} />
		</div>

	</div>
};
export default Controller