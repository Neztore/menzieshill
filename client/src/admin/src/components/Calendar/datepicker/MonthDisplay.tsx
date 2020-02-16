// Created by josh on 16/02/2020
import React, {FunctionComponent} from "react";
import { Months } from "../../../shared/util";

interface MonthDisplayProps {
    setDisplayDate: Function,
    displayDate: Date
}


export const MonthDisplay: FunctionComponent<MonthDisplayProps> = ({setDisplayDate, displayDate}) => {

    function setMonth (newMonth: 1 | -1) {
        const newDate = new Date(displayDate.getTime())
        newDate.setMonth(newDate.getMonth() + newMonth)
        setDisplayDate(newDate)
    }
    return <div className="month noselect">
        <ul>
            <li onClick={()=>setMonth(-1)} className="prev">❮</li>
            <li onClick={()=>setMonth(1)} className="next">❯</li>
            <li className="month-info">
                <span>{Months[displayDate.getMonth()]}</span><br/>
                <span style={{fontSize:"18px"}}>{displayDate.getFullYear()}</span>
            </li>
        </ul>

    </div>
};
export default MonthDisplay

