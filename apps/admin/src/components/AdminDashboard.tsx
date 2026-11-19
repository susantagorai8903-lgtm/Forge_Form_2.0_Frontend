"use client";

import { useEffect, useState } from "react";
import type { AdminUser } from "@forge-form/shared/types";
import { adminRequest, errorMessage } from "@/lib/admin-client";

type Overview = {
  enquiries: number;
  bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  enquiry_to_booking_rate: number;
  booking_confirmation_rate: number;
};
type Analytics = Record<string, unknown>;

export function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      adminRequest<AdminUser>("auth/me"),
      adminRequest<Overview>("admin/analytics/overview"),
      adminRequest<Analytics>("admin/analytics/bookings"),
      adminRequest<Analytics>("admin/analytics/enquiries"),
      adminRequest<Analytics>("admin/analytics/conversion"),
    ]).then(([currentUser, stats, bookings, enquiries, conversion]) => {
      if (!active) return;
      setUser(currentUser);
      setOverview(stats);
      setAnalytics([bookings, enquiries, conversion]);
    }).catch((requestError: unknown) => {
      if (active) setError(errorMessage(requestError));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) {
      const result = await response.json() as { message?: string };
      setError(result.message ?? "Sign out could not be completed.");
      return;
    }
    window.location.assign("/admin/login");
  }

  if (loading) return <section className="page-shell"><p role="status">Loading dashboard…</p></section>;
  if (error) return <section className="page-shell"><p className="message error" role="alert">{error}</p><a className="button" href="/admin/login">Sign in again</a></section>;

  return (
    <section className="page-shell">
      <p className="eyebrow">Admin dashboard</p>
      <h1>Overview.</h1>
      <p>Signed in as {user?.full_name} · {user?.roles.join(", ")}</p>
      <div className="actions"><a className="button" href="/admin/bookings">Bookings</a><a className="button" href="/admin/contacts">Contact enquiries</a><a className="button" href="/admin/content">Content</a><button className="button secondary" onClick={logout}>Sign out</button></div>
      {overview && <div className="stat-grid">
        <article className="stat-card"><strong>{overview.bookings}</strong><span>Booking requests</span></article>
        <article className="stat-card"><strong>{overview.pending_bookings}</strong><span>Pending requests</span></article>
        <article className="stat-card"><strong>{overview.confirmed_bookings}</strong><span>Confirmed</span></article>
        <article className="stat-card"><strong>{overview.enquiries}</strong><span>Contact enquiries</span></article>
        <article className="stat-card"><strong>{(overview.booking_confirmation_rate * 100).toFixed(1)}%</strong><span>Booking confirmation rate</span></article>
      </div>}
      {analytics.map((report, index) => <details key={index}><summary>Analytics report {index + 1}</summary><pre>{JSON.stringify(report, null, 2)}</pre></details>)}
      <p className="muted">Analytics are aggregates returned by the existing API. They do not represent revenue, membership, or person-level attribution.</p>
    </section>
  );
}
