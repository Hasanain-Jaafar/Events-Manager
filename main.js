const inputs = document.querySelectorAll("input");
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  // document.querySelector(".event-date").setAttribute("min",today);
  // OR
  const eventDate = document.querySelector(".event-date");
  eventDate.min = today;
  eventDate.addEventListener("input", function () {
    if (eventDate.value < today) {
      eventDate.value = today;
    }
  });
}
function fireAlertMsg() {
  inputs.forEach((input) => {
    if (input.classList.contains("redAlert") && input == "") {
      input.classList.toggle("redAlert");
    } else {
      input.classList.add("redAlert");
    }
  });
}

setMinDate();
function addEvent() {
  const eventName = document.querySelector(".event-name").value;
  const eventDate = document.querySelector(".event-date").value;
  const eventOrganizer = document.querySelector(".organizer").value;
  const eventDescription = document.querySelector(".event-description").value;
  const alertMsg = document.querySelector(".alert");
  // get time in milliseconds from Epoch time to event date
  const eventTimeStamp = new Date(eventDate).getTime();
  //  Start of Time ---------- today time ---------- Event date = Event Date - Today
  if (eventName && eventDate && eventOrganizer && eventDescription) {
    alertMsg.style.opacity = 0;
    //  Create Event Object
    const event = {
      name: eventName,
      date: eventDate,
      organizer: eventOrganizer,
      timeStamp: eventTimeStamp,
      eventDescription: eventDescription,
    };
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    document.querySelector(".event-description").value = "";
    displayEvents();
  } else {
    alertMsg.style.opacity = 1;
    fireAlertMsg();
  }
}
function displayEvents() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const eventsList = document.querySelector(".events");
  eventsList.innerHTML = "";
  if (eventsList) {
    eventsList.classList.add("bg-style");
  } else {
    eventsList.classList.remove("bg-style");
  }

  events.forEach((event, index) => {
    const now = new Date().getTime();
    const timeLeft = event.timeStamp - now;
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    const countDown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    eventsList.innerHTML += `
        <div class="event">
          <div class="event-head">
            <h3>${event.name}</h3>
            <p><span>Time Left:</span> ${countDown}</p>
          </div>
          <div class="description">
            <div class="desc-section-left">
            <h5>Description</h5>
            <p>${event.eventDescription}</p>
            </div>
            <div class="desc-section-right">
            <p><span>By: </span>${event.organizer}</p>
            <p><span>Date: </span>${event.date}</p>
            <button onclick="deleteEvent(${index})">Delete</button>
            </div>
            
          </div>
          
        </div>
        `;
  });
}
displayEvents();

function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("events"));
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
  displayEvents();
}
setInterval(displayEvents, 1000);
