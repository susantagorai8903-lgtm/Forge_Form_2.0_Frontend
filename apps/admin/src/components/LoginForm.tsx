"use client";

import { useState, type FormEvent } from "react";

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) {
        setMessage(result.message ?? "Sign in failed.");
        return;
      }
      window.location.assign("/admin");
    } catch {
      setMessage("The sign-in service could not be reached. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel" onSubmit={submit}>
      <label className="field">Email<input type="email" name="email" autoComplete="username" required maxLength={254} /></label>
      <label className="field">Password<input type="password" name="password" autoComplete="current-password" required maxLength={256} /></label>
      {message && <p className="message error" role="alert">{message}</p>}
      <button className="button" type="submit" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
