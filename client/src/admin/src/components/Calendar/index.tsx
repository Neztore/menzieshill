import  React, { useState } from "react";
import Controller from "./Controller";
import EventBrowser from "./EventBrowser";

export function Calendar() {
  const [filter, setFilter] = useState(0);
  // We only actually use the month from this, but it makes it easier for wrap-arounds.
  const [displayDate, setDate] = useState(new Date());
  const [selectedId, setSelectedId] = useState<number|undefined>();
    return <div>
       <Controller filterNo={filter} setFilter={setFilter} displayDate={displayDate} setDate={setDate} setSelected={setSelectedId}/>
       <EventBrowser displayDate={displayDate} filterNo={filter} selectedId={selectedId} setSelectedId={setSelectedId}/>
    </div>
}
export  default Calendar
