// Created by josh on 16/02/2020
import React, {FunctionComponent, useState, Fragment, useEffect} from "react";
import '../../../../../css/calendar.css'
import MonthDisplay from "./MonthDisplay";
import WeekDaysDisplay from "./Weekdays";
// By default this component will render the month of the provided initialDate.
// It will allow for the month to be varied until a date is selected.



interface DatePickerProps {
    initialDate?: Date,
    handleSelected: Function
}

export const DatePicker: FunctionComponent<DatePickerProps> = ({initialDate = new Date(), handleSelected}) => {
    // Only Month & Year of this date are actually used.
    const [displayDate, setDisplayDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [columns, setColumns] = useState<Array<Array<number>>>([]);

    function setDay (dateNum: number) {
        if (dateNum !== 0) {
            const newDate = new Date(selectedDate.getTime());
            newDate.setDate(dateNum);
            setSelectedDate(newDate)
            handleSelected(newDate);
        }
    }

    useEffect(()=>{
        const columns: Array<Array<number>> = [[],[],[],[],[],[],[]];


        let initial = startDay(displayDate.getFullYear(), displayDate.getMonth());
        const endDay = daysInMonth(displayDate.getFullYear(), displayDate.getMonth());


        if (initial === 0) {
            // sunday.
            initial = 7
        }
        initial = initial - 1;

        // Generate days
        let day = 0;
        for (let counter = 0; counter <= (endDay + (initial - 1)); counter ++) {
            if ((counter) < initial) {
                columns[day].push(0)
            } else {
                columns[day].push((counter - initial) + 1)
            }
            if (day===6) {
                day = 0
            } else day++;
        }
       setColumns(columns)
    }, []);


    let selectedNum = -1;
    if (selectedDate.getFullYear() === displayDate.getFullYear()) {
        selectedNum = selectedDate.getDate()
    }

    return <Fragment>
        <MonthDisplay setDisplayDate={setDisplayDate} displayDate={displayDate}/>
        <WeekDaysDisplay/>

        <div className="days columns has-text-centered is-mobile noselect">
            {
                columns.map((column)=>
                    <div className="column" key={Math.random()}>
                        <ul>
                            {
                                column.map((item)=> <li
                                    onClick={()=> setDay(item)}
                                    key={`sub-${item}`}

                                    className={item === 0 ? "blank":   `${selectedNum === item ? "active":""}`}>

                                    {item}
                                </li>)
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    </Fragment>
};
export default DatePicker

function startDay (year: number, month:number) {
    return new Date(year, month, 1).getDay();
}
function daysInMonth (year:number, month:number) {
    // 0 wraps around to previous month. Hence, +1.
    return new Date(year, month + 1, 0).getDate();
}

