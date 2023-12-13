const COHORT = "2310-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getEvents();
  await renderEvents();
}
render();

/**
 * Update state with events from API
 */
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Render events from state
 */
function renderEvents() {
    if (!state.events.length) {
      eventList.innerHTML = "<li>No events</li>";
      return;
    }
  
    const eventsCards = state.events.map((event) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h2>${event.name}</h2>
        <p>${event.location}</p>
        <date>${event.date}</date>
        <p>${event.description}</p>
        <button class="delete-button" data-event-id="${event._id}">Delete</button>`;
  
      return li;
    });
  
    eventList.replaceChildren(...eventsCards);
  
    // Add event listener to the parent container (eventList) for event delegation
    eventList.addEventListener("click", handleDeleteButtonClick);
  }
  
  /**
   * Event handler for "Delete" button clicks
   * @param {Event} event
   */
  async function handleDeleteButtonClick(event) {
    const target = event.target;
  
    if (target.classList.contains("delete-button")) {
      const eventId = target.getAttribute("data-event-id");
      console.log("Deleting event with ID:", eventId);
  
      try {
        const response = await fetch(`${API_URL}/${eventId}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
  
        render();
      } catch (error) {
        console.error(error);
      }
    }
  }
  
/**
 * Ask the API to create a new event based on form data
 */
async function addEvent(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: new Date(addEventForm.date.value).toISOString(),
        location: addEventForm.location.value,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask the API to delete an event
 */
async function deleteEvent(eventId) {
    try {
      console.log("Deleting event with ID:", eventId);
  
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
      });
  
      console.log("Delete response:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to delete event:", errorData);
        throw new Error("Failed to delete event");
      }
  
      render();
    } catch (error) {
      console.error(error);
    }
  }
  
  
  
  
