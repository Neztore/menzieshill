// Javascript code for the Calendar widget.
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" , "November", "December"];


function parseDate (dateString) {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Date stuff
// Done to prevent polluting globals.
// Not class because of I.E and it doesn't really make much of a difference.
const calendar = {
  displayDate: new Date(),
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

  update: function () {
    const monthInfo = this.calendar.getElementsByClassName("month-info")[0]
    // Set month text
    monthInfo.children[0].innerText = months[this.displayDate.getMonth()];
    // account for <br> with 2
    monthInfo.children[2].innerText = this.displayDate.getFullYear();
    const daysContainer = this.calendar.getElementsByClassName("days")[0];
    const columns = [];

    // Better way to remove?
    while (daysContainer.children.length !== 0) {
      console.log("Remove child")
      daysContainer.removeChild(daysContainer.children[0])
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

    const initial = this.startDay(this.displayDate.getFullYear(), this.displayDate.getMonth());
    const endDay = this.daysInMonth(this.displayDate.getFullYear(), this.displayDate.getMonth());

    // Add blanks
    for (let count = 0; count < initial - 1; count++) {
      const newDay = document.createElement("li");
      newDay.innerText = "-";
      columns[count].appendChild(newDay)
    }


    let day = initial - 1;
    for (let counter = initial + 1; counter <= endDay + initial; counter ++) {
      const newDay = document.createElement("li");
      newDay.innerText = counter - initial;
      if (!columns[day]) console.log("!!!", day)
      columns[day].appendChild(newDay);


      if (day===6) {
        day = 0
      } else day++;
    }
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