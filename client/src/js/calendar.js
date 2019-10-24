// Javascript code for the Calendar widget.
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" , "November", "December"];


function parseDate (dateString) {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Date stuff
// Done to prevent polluting globals.
const calendar = {
  displayDate: new Date(),
  selectedDate: new Date(),
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
    const events = await Api.getEvents()
    const monthInfo = this.calendar.getElementsByClassName("month-info")[0]
    // Set month text
    monthInfo.children[0].innerText = months[this.displayDate.getMonth()];
    // account for <br> with 2
    monthInfo.children[2].innerText = this.displayDate.getFullYear();
    const daysContainer = this.calendar.getElementsByClassName("days")[0];
    const columns = [];

    // Better way to remove?
    while (daysContainer.firstChild) {
      daysContainer.removeChild(daysContainer.firstChild)
    }

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
        newDay.className = "blank"
        columns[day].appendChild(newDay)
      } else {

        const newDay = document.createElement("li");

        const dayOfMonth = (counter - initial) + 1
        newDay.innerText = dayOfMonth

        // Use this to check for events to add / selections.
        const date = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth(), dayOfMonth)
        this.setupDay(newDay, date)

        columns[day].appendChild(newDay);
      }
      if (day===6) {
        day = 0
      } else day++;
    }
},

  // Add click events etc.
  async setupDay(dayElement, date) {
    if (this.selectedDate.toDateString() === date.toDateString()) {
      dayElement.className = "active"
    }
    const that = this
    dayElement.addEventListener("click", function () {
      that.selectedDate = date
      that.update()
    })

    // Check for events
    //TODO: Add start,end dates.


  },

  startDay (year, month) {
    return new Date(year, month, 1).getDay();
  },
  daysInMonth (year, month) {
    // 0 wraps around to previous month. Hence, +1.
    return new Date(year, month + 1, 0).getDate();
  },


};



addEventListener("load", function () {

  calendar.init()

});