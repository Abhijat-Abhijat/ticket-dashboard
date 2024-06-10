import React, { useState, useEffect, FormEvent, useCallback } from "react";
import "./TicketDashboard.css";

interface Ticket {
  title: string;
  description: string;
  email: string;
}

const getInitialTickets = (): Ticket[] => {
  const storedTickets = localStorage.getItem("tickets");
  return storedTickets ? JSON.parse(storedTickets) : [];
};

const TicketDashboard: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [tickets, setTickets] = useState<Ticket[]>(getInitialTickets);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !email) {
      setError("All fields are required.");
      return;
    }
    const newTicket: Ticket = { title, description, email };
    setTickets((prevTickets) => [...prevTickets, newTicket]);
    setTitle("");
    setDescription("");
    setEmail("");
    setError("");
  };

  const handleDelete = (index: number) => {
    setTickets((prevTickets) => prevTickets.filter((_, i) => i !== index));
  };

  const handleToggleDescription = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderTickets = useCallback(() => {
    return tickets.map((ticket, index) => (
      <div key={index} className="ticket">
        <div className="ticket-columns">
          <h3>{ticket.title}</h3>
          <small>{ticket.email}</small>
        </div>
        <div className="ticket-columns">
          <p>
            {expandedIndex === index
              ? ticket.description
              : ticket.description.length > 50
              ? `${ticket.description.substring(0, 50)}...`
              : ticket.description}
            {ticket.description.length > 50 && (
              <button
                className="more-button"
                onClick={() => handleToggleDescription(index)}
              >
                {expandedIndex === index ? "Less" : "More"}
              </button>
            )}
          </p>
          <button onClick={() => handleDelete(index)} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    ));
  }, [tickets, expandedIndex]);

  return (
    <div className="ticket-dashboard">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Submit Ticket</button>
      </form>
      <div className="ticket-list">{renderTickets()}</div>
    </div>
  );
};

export default TicketDashboard;
