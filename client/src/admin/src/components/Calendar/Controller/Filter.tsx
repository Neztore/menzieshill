// Created by josh on 05/04/2020
import React, {FunctionComponent} from "react";

interface FilterProps {
	setFilter: Function,
	filterType: number
}
export enum FilterType {
	all,
	normal,
	recurring
}

export const Filter: FunctionComponent<FilterProps> = ({setFilter, filterType}) => {

	return <div className="field has-addons">
		<p className="control">
			<button className={`button ${filterType === FilterType.all ? "is-active":""}`} onClick={()=>setFilter(FilterType.all)}>
      <span className="icon is-small">
        <i className="fas fa-calendar"/>
      </span>
				<span>All</span>
			</button>
		</p>
		<p className="control">
			<button className={`button ${filterType === FilterType.normal ? "is-active":""}`} onClick={()=>setFilter(FilterType.normal)}>
      <span className="icon is-small">
       <i className="fas fa-calendar-day"/>
      </span>
				<span>Normal</span>
			</button>
		</p>
		<p className="control">
			<button className={`button ${filterType === FilterType.recurring ? "is-active":""}`} onClick={()=>setFilter(FilterType.recurring)}>
      <span className="icon is-small">
        <i className="fas fa-calendar-alt"/>
      </span>
				<span>Recurring</span>
			</button>
		</p>
	</div>
};
export default Filter