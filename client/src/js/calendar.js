// Javascript code for the Calendar widget.

function addDay (date) {
  const calendar = document.getElementsByClassName("calendar")[0]
  if (!calendar) { return console.error("Failed to hook calendar!") }

  const day = document.createElement("div");
  day.className = "day"

  const dayTitle = document.createElement("h3");
  dayTitle.className = "is-size-5"
  const dayText = document.createTextNode(parseDate(date))
  dayTitle.appendChild(dayText)

  day.appendChild(dayTitle)
  calendar.appendChild(day)
  return day
}

/*
  Todo
    - Add start and end support
    - Add pop-up modal
    - Different colour support?
    - (Maybe) try to make it look better?
    - Add scroll to current day.
 */


function addEvent (day, eventInfo) {
  const event = document.createElement("div")
  event.className = "event has-background-primary"
  // Todo: Custom background / random background?

  const time = document.createElement("span")
  time.className = "time"
  const timeText = document.createTextNode(eventInfo.time + ": ") // this probably isn't right
  time.appendChild(timeText)
  event.appendChild(time)

  const eventText = document.createTextNode(eventInfo.name)
  event.appendChild(eventText)

  day.appendChild(event)
}



const d = addDay(new Date())
addEvent(d, {
  time: "17:00",
  name: "Swimming Session",
})

addEvent(d, {
  time: "17:00",
  name: "Water Polo session",
})

addEvent(d, {
  time: "17:00",
  name: "session",
})
const d2 = addDay(new Date())
addEvent(d2, {
  time: "00:00",
  name: "New day celebration event.",
})


addEvent(d2, {
  time: "15:00",
  name: "party.",
})


const d3 = addDay(new Date())
addEvent(d3, {
  time: "00:00",
  name: "New day celebration event.",
})


addEvent(d3, {
  time: "15:00",
  name: "party.",
})

const dLast = addDay(new Date())
addEvent(dLast, {
  time: "00:00",
  name: "Last day.",
})


addEvent(dLast, {
  time: "15:00",
  name: "ok.",
})


function eventClicked () {

}

function scrollToToday () {

}


function openModal (eventInfo) {

}

function closeModal () {


}

function parseDate (dateString) {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}