"use client";

import { useCallback, useEffect, useState } from "react";
import { adminRequest, errorMessage } from "@/lib/admin-client";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  goals: string;
  preferredContact: string;
  message: string;
  status: string;
  createdAt: string;
};

const enquiryStatuses = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"];

export function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setContacts(await adminRequest<Contact[]>("admin/contacts"));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function updateStatus(contact: Contact, status: string) {
    setBusy(contact.id);
    setError("");
    try {
      await adminRequest(`admin/contacts/${contact.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy("");
    }
  }

  async function remove(contact: Contact) {
    if (!window.confirm(`Delete the enquiry from ${contact.name}? This cannot be undone.`)) return;
    setBusy(contact.id);
    setError("");
    try {
      await adminRequest(`admin/contacts/${contact.id}`, { method: "DELETE" });
      await load();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="page-shell">
      <p className="eyebrow">Administration</p>
      <h1>Contact enquiries.</h1>
      <p><a href="/admin">← Dashboard</a></p>
      {error && <p className="message error" role="alert">{error}</p>}
      {loading ? <p role="status">Loading contact enquiries…</p> : contacts.length === 0 ? <p className="message">No contact enquiries were returned.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>Contact</th><th>Enquiry</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{contacts.map((contact) => (
            <tr key={contact.id}>
              <td><strong>{contact.name}</strong><br /><a href={`mailto:${contact.email}`}>{contact.email}</a><br />{contact.phone}<br /><span className="muted">{contact.preferredContact}</span></td>
              <td>{contact.program}<br />{contact.goals}<br />{contact.message}<br /><span className="muted">{new Date(contact.createdAt).toLocaleString()}</span></td>
              <td>{contact.status}</td>
              <td><div className="actions">
                <select disabled={busy === contact.id} value={contact.status} onChange={(event) => void updateStatus(contact, event.target.value)}>
                  {enquiryStatuses.map((status) => <option value={status} key={status}>{status}</option>)}
                </select>
                <button className="button secondary" disabled={busy === contact.id} onClick={() => void remove(contact)}>Delete</button>
              </div></td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </section>
  );
}
