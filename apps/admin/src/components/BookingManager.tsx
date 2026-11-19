"use client";

import { useCallback, useEffect, useState } from "react";
import { getTrainers } from "@forge-form/shared/content";
import type { Trainer } from "@forge-form/shared/types";
import { adminRequest, errorMessage } from "@/lib/admin-client";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  date: string;
  time: string;
  status: string;
  goals: string;
};

const transitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED", "REJECTED"],
  CONFIRMED: ["CANCELLED", "COMPLETED"],
  CANCELLED: [],
  COMPLETED: [],
  REJECTED: [],
};

export function BookingManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const [rows, activeTrainers] = await Promise.all([
        adminRequest<Booking[]>("admin/bookings"),
        getTrainers(),
      ]);
      setBookings(rows);
      setTrainers(activeTrainers);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function updateStatus(booking: Booking, status: string) {
    setBusy(booking.id);
    setError("");
    try {
      await adminRequest(`admin/bookings/${booking.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy("");
    }
  }

  async function assignTrainer(bookingId: string, trainerId: string) {
    setBusy(bookingId);
    setError("");
    try {
      await adminRequest(`admin/bookings/${bookingId}/assign-trainer`, {
        method: "PATCH",
        body: JSON.stringify({ trainer_id: trainerId }),
      });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="page-shell">
      <p className="eyebrow">Administration</p>
      <h1>Booking requests.</h1>
      <p><a href="/admin">← Dashboard</a></p>
      {error && <p className="message error" role="alert">{error}</p>}
      {loading ? <p role="status">Loading booking requests…</p> : bookings.length === 0 ? <p className="message">No booking requests were returned.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Request</th><th>Program & preferred time</th><th>Status</th><th>Update status</th><th>Assign coach</th></tr></thead>
          <tbody>{bookings.map((booking) => (
            <tr key={booking.id}>
              <td><strong>{booking.name}</strong><br />{booking.email}<br />{booking.phone}<br /><span className="muted">{booking.goals}</span></td>
              <td>{booking.program}<br />{booking.date} · {booking.time}<br /><span className="muted">Preferred, not necessarily confirmed</span></td>
              <td>{booking.status}</td>
              <td><select disabled={busy === booking.id || transitions[booking.status]?.length === 0} value="" onChange={(event) => { if (event.target.value) void updateStatus(booking, event.target.value); }}>
                <option value="">Choose…</option>{(transitions[booking.status] ?? []).map((status) => <option value={status} key={status}>{status}</option>)}
              </select></td>
              <td><select disabled={busy === booking.id || trainers.length === 0} value="" onChange={(event) => { if (event.target.value) void assignTrainer(booking.id, event.target.value); }}>
                <option value="">Choose coach…</option>{trainers.filter((trainer) => trainer.id).map((trainer) => <option value={trainer.id} key={trainer.id}>{trainer.name}</option>)}
              </select></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      {!loading && trainers.length === 0 && <p className="muted">No active trainers are available for assignment.</p>}
    </section>
  );
}
