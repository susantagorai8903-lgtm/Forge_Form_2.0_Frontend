"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminRequest, errorMessage } from "@/lib/admin-client";

type ResourceKey = "programs" | "trainers" | "testimonials" | "blog" | "locations" | "notifications";
type Mode = "create" | "update" | "delete";

const resourceInfo: Record<ResourceKey, { label: string; list?: string; writable?: string; deletable?: boolean; body: Record<string, unknown> }> = {
  programs: {
    label: "Programs",
    writable: "programs",
    deletable: true,
    body: { name: "", slug: "", category: "", description: "", short_description: "", benefits: [], target_audience: "", image_url: "", is_active: true, display_order: 0 },
  },
  trainers: {
    label: "Trainers",
    writable: "trainers",
    deletable: true,
    body: { full_name: "", slug: "", designation: "", biography: "", profile_image: "", specializations: [], experience_years: null, is_active: true },
  },
  testimonials: {
    label: "Testimonials",
    list: "testimonials",
    writable: "testimonials",
    deletable: true,
    body: { customer_name: "", customer_image: "", content: "", rating: 5, program_id: null, is_published: false },
  },
  blog: {
    label: "Blog articles",
    list: "blog",
    writable: "blog",
    deletable: true,
    body: { title: "", slug: "", excerpt: "", content: [], featured_image: "", category_id: "", reading_time: "", is_published: false, published_at: null },
  },
  locations: {
    label: "Locations",
    list: "locations",
    writable: "locations",
    body: { name: "", address: "", city: "", state: "", postal_code: "", country: "USA", phone: "", email: "", latitude: null, longitude: null, opening_hours: null, is_active: true },
  },
  notifications: {
    label: "Notifications",
    list: "notifications",
    body: {},
  },
};

export function ContentManager() {
  const [resource, setResource] = useState<ResourceKey>("testimonials");
  const [mode, setMode] = useState<Mode>("create");
  const [recordId, setRecordId] = useState("");
  const [body, setBody] = useState(JSON.stringify(resourceInfo.testimonials.body, null, 2));
  const [records, setRecords] = useState<unknown[]>([]);
  const [recordsError, setRecordsError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const info = resourceInfo[resource];
  const canList = Boolean(info.list);
  const canWrite = Boolean(info.writable);
  const modes = useMemo<Mode[]>(() => [
    ...(canWrite ? ["create" as const, "update" as const] : []),
    ...(info.deletable ? ["delete" as const] : []),
  ], [canWrite, info.deletable]);

  const load = useCallback(async () => {
    if (!info.list) {
      setRecords([]);
      setRecordsError("");
      return;
    }
    setLoading(true);
    setRecordsError("");
    try {
      setRecords(await adminRequest<unknown[]>(`admin/${info.list}`));
    } catch (requestError) {
      setRecordsError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [info.list]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    setMode(modes[0] ?? "create");
    setRecordId("");
    setBody(JSON.stringify(info.body, null, 2));
    setError("");
    setMessage("");
  }, [info, modes]);

  async function submit() {
    if (!info.writable || saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    let payload: unknown;
    if (mode !== "delete") {
      try {
        payload = JSON.parse(body);
      } catch {
        setError("Enter a valid JSON request body.");
        setSaving(false);
        return;
      }
    }
    if ((mode === "update" || mode === "delete") && !recordId.trim()) {
      setError("Enter the record ID for this operation.");
      setSaving(false);
      return;
    }

    const suffix = mode === "create" ? "" : `/${encodeURIComponent(recordId.trim())}`;
    const method = mode === "create" ? "POST" : mode === "update" ? "PUT" : "DELETE";
    try {
      const result = await adminRequest<unknown>(`admin/${info.writable}${suffix}`, {
        method,
        ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
      });
      setMessage(result ? `Saved: ${JSON.stringify(result)}` : "The operation completed.");
      await load();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-shell">
      <p className="eyebrow">Administration</p>
      <h1>Content management.</h1>
      <p><a href="/admin">← Dashboard</a></p>
      <div className="resource-layout">
        <nav className="resource-list" aria-label="Content resources">
          {(Object.keys(resourceInfo) as ResourceKey[]).map((key) => (
            <button type="button" className={resource === key ? "active" : ""} key={key} onClick={() => setResource(key)}>{resourceInfo[key].label}</button>
          ))}
        </nav>
        <div>
          <div className="panel">
            <h2>{info.label}</h2>
            {modes.length > 0 && <label className="field">Operation<select value={mode} onChange={(event) => setMode(event.target.value as Mode)}>{modes.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>}
            {(mode === "update" || mode === "delete") && <label className="field">Record ID<input value={recordId} onChange={(event) => setRecordId(event.target.value)} placeholder="UUID from the record list or creation response" /></label>}
            {mode !== "delete" && canWrite && <label className="field">Request body (JSON)<textarea value={body} onChange={(event) => setBody(event.target.value)} spellCheck={false} /></label>}
            {!canWrite && <p className="message">This backend resource is read-only in the current API.</p>}
            {canWrite && <p className="muted">The API validates every operation. Use only the backend request fields for this resource. Changes are applied immediately.</p>}
            {error && <p className="message error" role="alert">{error}</p>}
            {message && <p className="message success" role="status">{message}</p>}
            {canWrite && <button className="button" type="button" onClick={submit} disabled={saving}>{saving ? "Saving…" : `${mode} ${info.label}`}</button>}
          </div>
          {resource === "programs" || resource === "trainers"
            ? <p className="message">The backend does not provide an administrative list endpoint for {info.label.toLowerCase()}. Use the record ID returned by a create operation or supplied by an authorized backend operator for updates and soft deletion.</p>
            : null}
          {resource === "blog" && <p className="message">The current blog list response omits record IDs. Updates and deletion require an ID obtained through an authorized backend process.</p>}
          {resource === "locations" && <p className="message">The current backend does not provide location deletion.</p>}
          {canList && <section>
            <h2>Existing {info.label.toLowerCase()}</h2>
            {recordsError && <p className="message error" role="alert">{recordsError}</p>}
            {loading ? <p role="status">Loading records…</p> : records.length ? records.map((record, index) => <pre key={index}>{JSON.stringify(record, null, 2)}</pre>) : !recordsError ? <p className="message">No records were returned.</p> : null}
          </section>}
        </div>
      </div>
    </section>
  );
}
