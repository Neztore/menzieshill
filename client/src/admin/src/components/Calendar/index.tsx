import  React from "react";
import DatePicker from "./datepicker";

export function Calendar() {
    return <div>
        <h1 className="title is-3">Calendar</h1>
        <p>This is the management homepage. Use the bar on the left to adjust various settings.</p>
        {/*  For testing */}
        <div className="columns">
            <div className="column is-half is-offset-one-quarter">
                <DatePicker handleSelected={(s:Date)=>console.log(`Selected ${s}`)}>
        </DatePicker>
            </div>
        </div>

    </div>
}
export  default Calendar