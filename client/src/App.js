import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// --- Registration Form Component ---
const RegisterForm = ({ eventId, onRegistrationSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/api/register", {
        eventId,
        name,
        email,
      });
      setMessage(response.data.message);
      setIsError(false);
      setName("");
      setEmail("");
      onRegistrationSuccess();
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage(error.response?.data?.message || "Registration failed.");
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h3>Register for this Event</h3>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="register-btn">
        Submit
      </button>
      {message && (
        <p className={`message ${isError ? "error" : "success"}`}>{message}</p>
      )}
    </form>
  );
};

// --- Event Card Component ---
const EventCard = ({ event }) => {
  const [showForm, setShowForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    setShowForm(false);
  };

  return (
    <div className="event-card">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Date:</strong> {formattedDate}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>

      {!registrationSuccess ? (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className="register-btn"
          >
            {showForm ? "Cancel" : "Register"}
          </button>
          {showForm && (
            <RegisterForm
              eventId={event._id}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          )}
        </>
      ) : (
        <p className="message success">You are registered for this event!</p>
      )}
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get("http://localhost:7000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="App">
    
      <header>
        <h1>Upcoming Events</h1>
      </header>
      <main className="event-list">
       
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event._id} event={event} />)
        ) : (
          <p>No events found. Try seeding the database!</p>
        )}
      </main>
     
      
    </div>
  );
}

export default App;
