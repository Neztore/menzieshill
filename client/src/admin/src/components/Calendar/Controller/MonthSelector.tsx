// Created by josh on 05/04/2020
import React, {FunctionComponent} from "react";
import { Months } from "../../../shared/util";

interface MonthSelectorProps {
	displayDate: Date,
	setDate: Function
}


export const MonthSelector: FunctionComponent<MonthSelectorProps> = ({displayDate, setDate}) => {
	function update (newMonth: 1 | -1) {
		const newDate = new Date(displayDate.getTime());
		newDate.setMonth(displayDate.getMonth() + newMonth);
		setDate(newDate)
	}

	return <div className="field has-addons">
		<p className="control">
			<button className="button" onClick={()=>update(-1)}>
      <span className="icon is-small">
       <i className="fas fa-angle-left"/>
      </span>
				<span>Previous</span>
			</button>
		</p>
		<p className="control">
			<button className="button is-static" style={{width: "8rem"}}>
				<span>{Months[displayDate.getMonth()]} <small>{displayDate.getFullYear()}</small></span>
			</button>
		</p>
		<p className="control">
			<button className="button" onClick={()=>update(1)}>
				<span>Next</span>
				<span className="icon is-small">
       <i className="fas fa-angle-right"/>
      </span>
			</button>
		</p>
	</div>
};
export default MonthSelector