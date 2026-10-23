
import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Plus,
  X,
  ArrowRight,
  Ticket,
  LoaderCircle,
} from "lucide-react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: "50",
    registrationDeadline: "",
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    studentId: "",
  });

  async function loadEvents() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/events`);
      if (!response.ok) throw new Error("Could not load events.");

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch {
      setError(
        "Unable to connect to the server. Make sure your backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    setBusy(true);
    setNotice("");

    try {
      const response = await fetch(`${API}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          capacity: Number(eventForm.capacity),
          date: new Date(eventForm.date).toISOString(),
          registrationDeadline: new Date(
            eventForm.registrationDeadline
          ).toISOString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not create the event.");
      }

      setNotice("Event created successfully!");
      setShowCreate(false);
      setEventForm({
        title: "",
        description: "",
        date: "",
        venue: "",
        capacity: "50",
        registrationDeadline: "",
      });
      await loadEvents();
    } catch (err) {
      setNotice(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function registerForEvent(e) {
    e.preventDefault();
    setBusy(true);
    setNotice("");

    try {
      const response = await fetch(
        `${API}/events/${selectedEvent._id}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(studentForm),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setNotice("Registration successful! Your seat is confirmed.");
      setSelectedEvent(null);
      setStudentForm({ name: "", email: "", studentId: "" });
      await loadEvents();
    } catch (err) {
      setNotice(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function remainingSeats(event) {
    return Math.max(0, (event.capacity || 0) - (event.seatsTaken || 0));
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon"><Ticket size={22} /></span>
          <span>Event<span className="brand-accent">Ease</span></span>
        </a>

        <nav>
          <a href="#events">Explore events</a>
          <button className="primary-button" onClick={() => {
            setNotice("");
            setShowCreate(true);
          }}>
            <Plus size={17} /> Create event
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR CAMPUS. YOUR COMMUNITY.</span>
            <h1>Make room for<br /><span>what matters.</span></h1>
            <p>
              Discover campus experiences, connect with your community,
              and save your seat at something unforgettable.
            </p>
            <a href="#events" className="hero-button">
              Explore events <ArrowRight size={18} />
            </a>
            <div className="hero-stats">
              <div><strong>{events.length}</strong><span>Events listed</span></div>
              <div><strong>{events.reduce((sum, e) => sum + remainingSeats(e), 0)}</strong><span>Seats available</span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>
            <div className="art-card">
              <span className="art-label">YOUR NEXT EXPERIENCE</span>
              <CalendarDays size={36} />
              <h3>Something<br />great is coming.</h3>
              <span className="art-footer">Discover. Register. Experience.</span>
            </div>
            <span className="floating-dot dot-one"></span>
            <span className="floating-dot dot-two"></span>
          </div>
        </section>

        <section id="events" className="events-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT'S HAPPENING</span>
              <h2>Explore events<span>.</span></h2>
              <p>Find your next opportunity to learn, build and connect.</p>
            </div>
            <span className="event-count">{events.length} events</span>
          </div>

          {notice && (
            <div className="notice" role="status">
              <span>{notice}</span>
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                <X size={17} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="empty-state">
              <LoaderCircle className="spinner" size={28} />
              <p>Loading campus events...</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <p>{error}</p>
              <button className="primary-button" onClick={loadEvents}>Try again</button>
            </div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={36} />
              <h3>No events yet</h3>
              <p>Create the first event and get your campus community involved.</p>
              <button className="primary-button" onClick={() => setShowCreate(true)}>
                <Plus size={17} /> Create an event
              </button>
            </div>
          ) : (
            <div className="event-grid">
              {events.map((event, index) => {
                const seats = remainingSeats(event);
                return (
                  <article className="event-card" key={event._id}>
                    <div className={`event-banner banner-${index % 4}`}>
                      <span className="banner-tag">CAMPUS EVENT</span>
                      <CalendarDays size={45} strokeWidth={1.3} />
                      <span className="banner-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="event-body">
                      <div className="event-date">
                        <CalendarDays size={15} /> {formatDate(event.date)}
                      </div>
                      <h3>{event.title}</h3>
                      <p className="event-description">{event.description}</p>
                      <div className="event-meta">
                        <span><MapPin size={15} /> {event.venue}</span>
                        <span><Users size={15} /> {seats} seats left</span>
                      </div>
                      <button
                        className="register-button"
                        disabled={seats <= 0 || new Date(event.date) <= new Date() ||
                          new Date(event.registrationDeadline) <= new Date()}
                        onClick={() => {
                          setNotice("");
                          setSelectedEvent(event);
                        }}
                      >
                        {seats <= 0 ? "Event full" : "Register now"}
                        {seats > 0 && <ArrowRight size={17} />}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#">
          <Ticket size={19} /> Event<span className="brand-accent">Ease</span>
        </a>
        <span>Bringing campus communities together.</span>
        <span>Built with MERN</span>
      </footer>

      {(showCreate || selectedEvent) && (
        <div className="modal-backdrop" onClick={() => {
          setShowCreate(false);
          setSelectedEvent(null);
        }}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="eyebrow">
                  {showCreate ? "GROW YOUR COMMUNITY" : "SAVE YOUR SPOT"}
                </span>
                <h2>{showCreate ? "Create an event" : "Register for event"}</h2>
                {selectedEvent && <p>{selectedEvent.title}</p>}
              </div>
              <button className="close-button" onClick={() => {
                setShowCreate(false);
                setSelectedEvent(null);
              }} aria-label="Close">
                <X size={21} />
              </button>
            </div>

            {showCreate ? (
              <form onSubmit={createEvent} className="form">
                <label>Event title
                  <input required maxLength="120" value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Introduction to Web Development" />
                </label>
                <label>Description
                  <textarea required maxLength="1000" value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="What will attendees experience?" />
                </label>
                <label>Venue
                  <input required value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    placeholder="e.g. Seminar Hall" />
                </label>
                <label>Event date and time
                  <input required type="datetime-local" value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                </label>
                <label>Registration deadline
                  <input required type="datetime-local" value={eventForm.registrationDeadline}
                    onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })} />
                </label>
                <label>Maximum attendees
                  <input required type="number" min="1" max="100000" value={eventForm.capacity}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} />
                </label>
                <button className="primary-button submit-button" disabled={busy}>
                  {busy ? "Creating..." : "Create event"} <ArrowRight size={17} />
                </button>
              </form>
            ) : (
              <form onSubmit={registerForEvent} className="form">
                <p className="form-hint">Enter your details to reserve a seat at this event.</p>
                <label>Full name
                  <input required maxLength="100" value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="Your full name" />
                </label>
                <label>College email
                  <input required type="email" value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="you@example.com" />
                </label>
                <label>Student ID
                  <input required maxLength="50" value={studentForm.studentId}
                    onChange={(e) => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    placeholder="Your student ID" />
                </label>
                <button className="primary-button submit-button" disabled={busy}>
                  {busy ? "Registering..." : "Confirm registration"} <ArrowRight size={17} />
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
