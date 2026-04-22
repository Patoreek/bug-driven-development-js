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

  // BUG: The component reads values via DOM instead of tracking them in state.
  // When the form is "reset" by clearing the state flag, the DOM inputs still
  // hold their old values because React doesn't control them.

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    submittedData.push({ name, email, message });
    setSubmitted(true);
  }

  function handleReset() {
    // BUG: Only resets the submitted flag — doesn't clear the input values
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
        <input id="name" name="name" type="text" data-testid="name-input" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" data-testid="email-input" />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" data-testid="message-input" />
      </div>
      <button type="submit" data-testid="submit-button">
        Send Message
      </button>
    </form>
  );
}
