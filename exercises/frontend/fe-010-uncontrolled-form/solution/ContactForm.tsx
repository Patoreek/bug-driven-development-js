import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

let submittedData: FormData[] = [];

export function getSubmittedData() {
  return submittedData;
}

export function resetSubmittedData() {
  submittedData = [];
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    submittedData.push({ name, email, message });
    setSubmitted(true);
  }

  function handleReset() {
    // FIX: Clear both the submitted flag AND the form field state
    setName("");
    setEmail("");
    setMessage("");
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div data-testid="success-message">
        <p>Thank you for your message!</p>
        <button data-testid="reset-button" onClick={handleReset}>
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          data-testid="name-input"
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          data-testid="message-input"
        />
      </div>
      <button type="submit" data-testid="submit-button">
        Send Message
      </button>
    </form>
  );
}
