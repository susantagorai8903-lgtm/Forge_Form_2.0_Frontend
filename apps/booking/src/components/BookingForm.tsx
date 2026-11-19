"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { apiRequest, ApiError } from "@forge-form/shared/api";
import { getPrograms } from "@forge-form/shared/content";
import { endpoints } from "@forge-form/shared/endpoints";
import type { BookingRequest, BookingResponse, Program } from "@forge-form/shared/types";
import { isValidEmail, isNonEmpty, validationMessage } from "@forge-form/shared/validation";

const steps = ["Your details", "Choose a program", "Pick a time", "Your goals", "Review"];
const sampleTimes = ["9:00 AM", "12:00 PM", "4:30 PM"];
const initialBooking: BookingRequest = {
  name: "",
  email: "",
  phone: "",
  program: "",
  date: "",
  time: "",
  goals: "",
  notes: "",
};

function localDate(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function BookingForm() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsError, setProgramsError] = useState("");
  const [booking, setBooking] = useState(initialBooking);
  const [step, setStep] = useState(0);
  const [minimumDate, setMinimumDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const key = useRef<string | null>(null);

  useEffect(() => {
    setMinimumDate(localDate());
    let active = true;
    getPrograms().then((items) => {
      if (active) setPrograms(items);
    }).catch((loadError: unknown) => {
      if (active) setProgramsError(loadError instanceof ApiError ? loadError.message : "Programs could not be loaded.");
    });
    return () => { active = false; };
  }, []);

  function update<K extends keyof BookingRequest>(field: K, value: BookingRequest[K]) {
    key.current = null;
    setBooking((current) => ({ ...current, [field]: value }));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    if (name in initialBooking) update(name as keyof BookingRequest, value);
  }

  function continueStep() {
    setError("");
    if (step === 0 && (!isNonEmpty(booking.name) || !isValidEmail(booking.email) || !isNonEmpty(booking.phone))) {
      setError("Enter your name, a valid email address, and phone number to continue.");
      return;
    }
    if (step === 1 && (!booking.program || !programs.some((program) => program.slug === booking.program))) {
      setError("Choose an available program to continue.");
      return;
    }
    if (step === 2) {
      const today = localDate();
      setMinimumDate(today);
      if (!booking.date || !booking.time) {
        setError("Choose a preferred date and sample time to continue.");
        return;
      }
      if (booking.date < today) {
        setError("Choose today or a future date for your request.");
        return;
      }
    }
    if (step === 3 && !isNonEmpty(booking.goals)) {
      setError("Share a little about your goals to continue.");
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  async function submit() {
    setError("");
    if (submitting) return;
    const today = localDate();
    setMinimumDate(today);
    if (!booking.date || booking.date < today || !booking.time || !booking.program) {
      setStep(!booking.program ? 1 : 2);
      setError("Choose an available program, today or a future date, and a preferred time before sending.");
      return;
    }
    setSubmitting(true);
    try {
      key.current ??= crypto.randomUUID();
      const response = await apiRequest<BookingResponse>(endpoints.bookings, {
        method: "POST",
        headers: { "Idempotency-Key": key.current },
        body: JSON.stringify(booking),
      });
      setResult(response);
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        setError([submitError.message, ...validationMessage(submitError.details)].join(". "));
      } else {
        setError("Your request could not be completed. Please try again or contact the studio.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="booking-card booking-result" role="status">
        <p className="eyebrow">Request received · Pending confirmation</p>
        <h2>Thank you for reaching out.</h2>
        <p>{result.message}</p>
        <p className="reference">Request reference: {result.id}</p>
        <p>Your selected date and time are preferences only. This is not a confirmed appointment.</p>
      </section>
    );
  }

  return (
    <section className="booking-card">
      <div className="progress">
        <div><span>Step {step + 1} of {steps.length}</span><span>{steps[step]}</span></div>
        <div className="progress-track"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      </div>
      {step === 0 && <fieldset>
        <legend>First, a little about you.</legend>
        <label>Full name<input name="name" autoComplete="name" maxLength={120} required value={booking.name} onChange={handleChange} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required value={booking.email} onChange={handleChange} /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" maxLength={30} required value={booking.phone} onChange={handleChange} /></label>
      </fieldset>}
      {step === 1 && <fieldset>
        <legend>What would you like to explore?</legend>
        {programsError ? <p className="message error" role="alert">{programsError}</p> : programs.length === 0 ? <p role="status">No programs are currently available.</p> : (
          <div className="program-options">{programs.map((program) => <label className={booking.program === program.slug ? "selected" : ""} key={program.slug}>
            <input type="radio" name="program" value={program.slug} checked={booking.program === program.slug} onChange={() => update("program", program.slug)} />
            <span><strong>{program.title}</strong><small>{program.summary}</small></span>
          </label>)}</div>
        )}
      </fieldset>}
      {step === 2 && <fieldset>
        <legend>When works for you?</legend>
        <p>These are sample request times only, not confirmed availability or studio hours.</p>
        <label>Preferred date<input type="date" name="date" min={minimumDate} value={booking.date} onChange={(event) => { update("date", event.target.value); update("time", ""); }} /></label>
        <div className="program-options">{sampleTimes.map((time) => <label className={booking.time === time ? "selected" : ""} key={time}>
          <input type="radio" name="time" value={time} checked={booking.time === time} disabled={!booking.date} onChange={() => update("time", time)} />
          <span><strong>{time}</strong><small>Preferred time request</small></span>
        </label>)}</div>
      </fieldset>}
      {step === 3 && <fieldset>
        <legend>What are you working toward?</legend>
        <label>Your goals<textarea name="goals" maxLength={1200} required value={booking.goals} onChange={handleChange} /></label>
        <label>Anything else? (optional)<textarea name="notes" maxLength={1200} value={booking.notes} onChange={handleChange} /></label>
      </fieldset>}
      {step === 4 && <fieldset>
        <legend>Review your request.</legend>
        <dl className="review">
          <dt>Name</dt><dd>{booking.name}</dd>
          <dt>Email</dt><dd>{booking.email}</dd>
          <dt>Phone</dt><dd>{booking.phone}</dd>
          <dt>Program</dt><dd>{programs.find((program) => program.slug === booking.program)?.title}</dd>
          <dt>Preferred date/time</dt><dd>{booking.date} · {booking.time} (unconfirmed)</dd>
          <dt>Goals</dt><dd>{booking.goals}</dd>
        </dl>
        <p>Your consultation request remains pending until the studio confirms it.</p>
      </fieldset>}
      {error && <p className="message error" role="alert">{error}</p>}
      <div className="form-actions">
        {step > 0 ? <button className="button secondary" type="button" onClick={() => { setError(""); setStep((current) => current - 1); }}>Back</button> : <span />}
        {step < steps.length - 1
          ? <button className="button" type="button" onClick={continueStep}>Continue</button>
          : <button className="button" type="button" onClick={submit} disabled={submitting}>{submitting ? "Sending request…" : "Send consultation request"}</button>}
      </div>
    </section>
  );
}
