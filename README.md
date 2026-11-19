# Forge & Form Personal Training

The workspace contains a Next.js public website, independent Booking and Admin
Next.js zones, a shared frontend package, and the FastAPI backend in
`../Forge-Form-Backend/`.

## Frontend zones

| App | Folder | Local port | Responsibility |
|---|---|---:|---|
| Website | `Forge-Form-Frontend/` | 3000 | Public pages, SEO, contact |
| Booking | `Forge-Form-Frontend/apps/booking/` | 3001 | Consultation request wizard |
| Admin | `Forge-Form-Frontend/apps/admin/` | 3002 | Protected operations and content |
| Shared | `Forge-Form-Frontend/packages/shared/` | — | API transport, content contracts, design tokens, brand chrome, validation |

Each Next.js app has its own `package.json`, lockfile, build, and `.env.example`.
Run `npm ci` and `npm run build` in the relevant app directory. The Website
project remains the existing Vercel project. Optional same-host Multi-Zone
rewrites require the actual `BOOKING_ZONE_ORIGIN` and `ADMIN_ZONE_ORIGIN`
Vercel project origins; leave them unset until deployment previews have been
verified.

The main website's existing `/book-consultation` page remains available as a
safe fallback until the Booking zone is configured. The Admin zone stores
tokens only in server-set `HttpOnly` cookies and proxies protected backend
requests; backend role checks remain authoritative.

## Backend quick start

Prerequisites: Python 3.12+ and Docker Compose. From `../Forge-Form-Backend/`:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
docker compose up -d postgres redpanda
python -m alembic upgrade head
python -m scripts.seed_data
```

Start the API with `uvicorn app.main:app --reload`, or run the API and both
workers using Compose. Do not start both API options at the same time. The
development API docs are at `http://localhost:8000/docs`. The seed script and
tests are for local/disposable databases only.

Create the first administrator interactively with
`python -m scripts.create_admin`; there are no default credentials.

## API configuration

Every frontend zone uses `NEXT_PUBLIC_API_BASE_URL` as a backend origin only,
for example `http://localhost:8000`. The shared client adds `/api/v1`.
Frontend integration details, exact route contracts, and unsupported admin
operations are documented in [`../docs/API_INTEGRATION.md`](../docs/API_INTEGRATION.md).

Public content requests use the API; local demo people, reviews, and articles
are not runtime fallbacks. Contact uses the existing `POST /api/v1/contact`
contract (not `/contact-enquiries`). Booking uses `POST /api/v1/bookings` with
an idempotency key and remains pending until studio confirmation.

## Architecture and deployment

See:

- [`../docs/MICRO_FRONTEND_ANALYSIS.md`](../docs/MICRO_FRONTEND_ANALYSIS.md)
- [`../docs/MICRO_FRONTEND_ARCHITECTURE.md`](../docs/MICRO_FRONTEND_ARCHITECTURE.md)
- [`../docs/MICRO_FRONTEND_DEPLOYMENT.md`](../docs/MICRO_FRONTEND_DEPLOYMENT.md)
- [`../Forge-Form-Backend/docs/architecture.md`](../Forge-Form-Backend/docs/architecture.md)
- [`../Forge-Form-Backend/docs/kafka-events.md`](../Forge-Form-Backend/docs/kafka-events.md)

The backend's outbox, broker, and notification workers remain unchanged.
Local Redpanda configuration does not verify production broker availability.
Do not change Render/Neon production configuration or enable Vercel rewrites
until actual deployment origins and CORS values have been checked.
