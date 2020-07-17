// Javascript code for the Calendar widget.


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" , "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const Repeats = {
  None: "None",
    Daily:"Daily",
    Weekly:"Weekly",
    Monthly:"Monthly"
}
if (typeof module !== 'undefined') {
  module.exports = calendar;
}
// Date stuff
// Done to prevent polluting globals.
const calendar = {
  displayDate: new Date(),
  selectedDate: new Date(),
  events: {}, // Key: Month-Year, value: Array of events
  recurringEvents: [], // ALL recurring events in an array.
  init () {
    const calendar = document.getElementsByClassName("calendar")[0];
    this.calendar = calendar;
    // Bind arrows
    calendar.getElementsByClassName("next")[0].addEventListener("click", this.nextMonth.bind(this))
    calendar.getElementsByClassName("prev")[0].addEventListener("click", this.prevMonth.bind(this))

    // initial state
    this.update()

  },
  prevMonth: function  () {
    this.displayDate.setMonth(this.displayDate.getMonth() - 1)
    this.update()
  },
  nextMonth: function () {
    const currentMonth = this.displayDate.getMonth()
    this.displayDate.setMonth( currentMonth+ 1)
    this.update()
  },
  // Don't ask me how this works.
  // Honestly? I don't know. Trial and error till the numbers worked.
  update: async function () {
    const monthInfo = this.calendar.getElementsByClassName("month-info")[0]
    // Set month text
    monthInfo.children[0].innerText = months[this.displayDate.getMonth()];
    // account for <br> with 2
    monthInfo.children[2].innerText = this.displayDate.getFullYear();
    const daysContainer = this.calendar.getElementsByClassName("days")[0];
    const columns = [];

    removeChildren(daysContainer)

    for (let counter = 0; counter < 7; counter++) {
      // For each column
      const newColumn = document.createElement("div");
      newColumn.className = "column ";

      daysContainer.appendChild(newColumn);
      const daysList = document.createElement("ul");
      newColumn.appendChild(daysList);

      // So we can add children to it.
      columns.push(daysList)
    }

    let initial = this.startDay(this.displayDate.getFullYear(), this.displayDate.getMonth());
    const endDay = this.daysInMonth(this.displayDate.getFullYear(), this.displayDate.getMonth());


    if (initial === 0) {
      // sunday.
      initial = 7
    }
    initial = initial - 1
    // Add blanks

    let day = 0
    for (let counter = 0; counter <= (endDay + (initial - 1)); counter ++) {
      if ((counter) < initial) {
        // Blank
        const newDay = document.createElement("li");
        newDay.innerText = "-";
        newDay.className = "blank";
        columns[day].appendChild(newDay)
      } else {

        const newDay = document.createElement("li");

        const dayOfMonth = (counter - initial) + 1;
        newDay.innerText = dayOfMonth;

        // Use this to check for events to add / selections.
        const date = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth(), dayOfMonth);
        this.setupDay(newDay, date);

        columns[day].appendChild(newDay);
      }
      if (day===6) {
        day = 0
      } else day++;
    }

    const eventsDisplay = document.getElementsByClassName("events-display")[0];

    const dayHeader = eventsDisplay.getElementsByTagName("h1")[0];

    dayHeader.innerText = this.selectedDate.toDateString();

    const eventsContainer = eventsDisplay.getElementsByClassName("events-padding")[0]
    removeChildren(eventsContainer)
    const hours = []
    const events = await this.getEventsOnDay(this.selectedDate)
    if (events.length === 0) {
      const p = document.createElement("p");
      p.className = "has-text-grey has-text-centered"
      p.innerText = "There are no events to show."
      eventsContainer.appendChild(p)
    }
    for (const event of events) {
      const time = new Date(event.when)
      const hour = time.getHours()+"",
        minutes = time.getMinutes()+"";
      const processedTime = `${hour.length > 1 ? hour : `0${hour}`}:${minutes.length > 1 ? minutes : `0${minutes}`}`

      // Get existing one for this hour, if it exists.
      let existing = hours.find((ele)=> ele.attributes.time.textContent === processedTime)
      if (!existing) {
        // create new
        existing = document.createElement("div");
        existing.setAttribute("time", processedTime);
        existing.className = "time";

        const timeText = document.createElement("h5");
        timeText.className = "is-size-5";
        timeText.innerText = processedTime;
        existing.appendChild(timeText);

        eventsContainer.appendChild(existing);
        hours.push(existing);
      }
      const eventItem = document.createElement("div");
      const colourClass = this.colourMappings[event.colour][0];
      const textClass = this.colourMappings[event.colour][1] ? `has-text-${this.colourMappings[event.colour][1]}` : ""
      const isCancelled = getCancellation(event)
      eventItem.className = `notification has-background-${colourClass} ${textClass} ${isCancelled ? "line-through":""}`
      eventItem.innerText = event.name;
      existing.appendChild(eventItem);
      const that = this

      eventItem.addEventListener("click", function () {
        that.viewEvent(event)
      })

    }


},

  // Add click events etc.
  async setupDay(dayElement, date, dayEvents) {
    if (this.selectedDate.toDateString() === date.toDateString()) {
      dayElement.className = "active"
    }
    const that = this;
    dayElement.addEventListener("click", function () {
      that.selectedDate = date;
      that.update()
    })
  },

  viewEvent (eventInfo) {
    const viewModal = new EventModal(document.body, eventInfo)
    viewModal.show()
  },

  async getEventsOnDay(date) {
    const monthString = date.getMonth() + date.getFullYear()
    if (!this.events[monthString]) {
      // It hasn't been loaded yet - load it.
      const monthEvents = await this.getEventsInMonth(date)
      if (!monthEvents.error) {
          this.events[monthString] = monthEvents
        } else {
        return false // oops !
      }
      }

    const eventsOnDay = []
    const targetDate = date.getDate(), // Most of this **should** match. its just making sure.
      targetMonth = date.getMonth(),
      targetYear = date.getFullYear(),
      targetDay = date.getDay();

    for (let event of this.events[monthString].events) {
      const eventDate = new Date(event.when)
      if (eventDate.getDate() === targetDate & eventDate.getMonth() === targetMonth && eventDate.getFullYear() === targetYear) {
        eventsOnDay.push(event)
      }
    }
    // Handle repeating events
    for (let recurringEvent of this.events[monthString].recurring) {
      const d = new Date(recurringEvent.when);
      if (recurringEvent.repeat === Repeats.Daily) { // we always take. it's daily.
        eventsOnDay.push(recurringEvent)

      } else if (recurringEvent.repeat === Repeats.Weekly) {
        if (d.getDay() === targetDay) { //only take if day of the WEEK matches
          eventsOnDay.push(recurringEvent)
        }

      } else if (recurringEvent.repeat === Repeats.Monthly) {
        if (d.getDate() === targetMonth) { // Only take if day of the MONTH matches
          eventsOnDay.push(recurringEvent)
        }
      }
    }
    eventsOnDay.sort((e)=>new Date(e.when).getHours())
    return eventsOnDay
  },

  getEventsInMonth (date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0)
    return Api.getEvents(start, end)
  },
  startDay (year, month) {
    return new Date(year, month, 1).getDay();
  },
  daysInMonth (year, month) {
    // 0 wraps around to previous month. Hence, +1.
    return new Date(year, month + 1, 0).getDate();
  },
  colourMappings: {
    LightGrey: ["grey-light"],
    Turqoise: ["primary", "white"],
    Yellow: ["warning"],
    Green: ["success"],
    White: ["white"],
    Black: ["black"],
    Blue: ["info"],
    Red: ["danger"]
  },


};

class EventModal extends GlobalModal {
  constructor (where, eventInfo) {
    super(where)
    this.info = eventInfo
    const modalCard = document.createElement("div")
    modalCard.className = "modal-card"
    this.card = modalCard

    const modalHead = document.createElement("div")
    modalHead.className = "modal-card-head"
    this.cardHead = modalHead

    const modalBody = document.createElement("div")
    modalBody.className = "modal-card-body calendar-modal"
    this.body = modalBody

    const modalFoot = document.createElement("div")
    modalFoot.className = "modal-card-foot"

    const cancel = document.createElement("button")
    cancel.className = "button"
    cancel.innerText = "Close"
    cancel.onclick = this.remove.bind(this)
    modalFoot.appendChild(cancel)

    this.cardFoot = modalFoot

    modalCard.appendChild(modalHead)
    modalCard.appendChild(modalBody)
    modalCard.appendChild(modalFoot)

    this.base.appendChild(modalCard)
  }
  addContent () {
    const cancellation = getCancellation(this.info)
    const info = this.info
    const title = document.createElement("p")
    title.className = `modal-card-title ${cancellation ? "line-through has-text-white" : ""}`
    title.innerText = info.name
    this.cardHead.appendChild(title)

    if (cancellation) {
      // We add on relevant cancellation info before adding rest of content.
      this.cardHead.classList.toggle("has-background-danger")
      const cancelledText = document.createElement("small")
      cancelledText.appendChild(document.createTextNode(" (Cancelled)"))
      cancelledText.className = "is-size-6 has-text-white"
      this.cardHead.appendChild(cancelledText)

      const info = document.createElement("p")
      const start = document.createTextNode("Cancelled by ")
      info.appendChild(start)
      const name = document.createElement("b")
      name.innerText = `${cancellation.cancelledBy.firstName} ${cancellation.cancelledBy.lastName}`
      info.appendChild(name)
      const end = document.createTextNode(` (${cancellation.cancelledBy.username}) - ${parseDate(new Date(cancellation.created), true)}`)
      info.appendChild(end)
      this.body.appendChild(info)

      const reasonTitle = document.createElement("h5")
      reasonTitle.className = "is-size-5"
      reasonTitle.innerText = "Reason:"
      this.body.appendChild(reasonTitle)

      const reason = document.createElement("p")
      reason.innerText = cancellation.reason
      reason.className = "cancel-reason"
      this.body.appendChild(reason)
      this.body.appendChild(document.createElement("hr"))
      const original = document.createElement("h5")
      original.className = "is-size-5"
      original.innerText = "Original information"
      this.body.appendChild(original)
    }
    const time = document.createElement("span")
    time.className = "has-text-black"
    const when = new Date(this.info.when)
    const endTime = new Date(when.getTime())
    endTime.setHours(when.getHours() + this.info.length || 2)

    const hrStart = when.getHours() + "",
      hrEnd = endTime.getHours()+"",
      minStart = when.getMinutes() +"",
      minEnd = endTime.getMinutes();

    const startString = `${hrStart.length > 1 ? hrStart : "0"+hrStart}:${minStart.length > 1 ? minStart : "0" + minStart}`
    const endString = `${hrEnd.length > 1 ? hrEnd : "0"+hrEnd}:${minEnd.length > 1 ? minEnd : "0" + minEnd}`
    time.innerText = `${days[when.getDay()]}, ${when.getDate()} ${months[when.getMonth()]}. ${startString} - ${endString}`
    this.body.appendChild(time)

    const about = document.createElement("p")
    about.innerText = unescapeHtml(this.info.description)
    this.body.appendChild(about)

    const level = document.createElement("div")
    level.className = "level"

    const repeat = document.createElement("div")
    repeat.classList = "level-item"
    repeat.innerText = `Repeat: ${this.info.repeat}`
    level.appendChild(repeat)

    const length = document.createElement("div")
    length.classList = "level-item"
    length.innerText = `Duration: ${this.info.length || "?"} hours`
    level.appendChild(length)


    const created = document.createElement("div")
    created.classList = "level-item"
    created.innerText = `Created: ${parseDate(new Date(this.info.created), true)}`
    level.appendChild(created)

    this.body.appendChild(level)


  }

}

function getCancellation (info) {
  const date = new Date(info.when)
  const targetDate = date.getDate(), // Only really applies for repeat events but its useful anyhow
    targetMonth = date.getMonth(),
    targetYear = date.getFullYear()

  for (let cancellation of info.cancellations) {
    const parsed = new Date(cancellation.when)
    if (parsed.getDate() === targetDate && parsed.getMonth() === targetMonth && parsed.getFullYear() === targetYear) {
      return cancellation
    }
  }
  return undefined
}


addEventListener("load", function () {

  calendar.init()

});

