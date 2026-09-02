# DockBook — Loading Bay Manager

Book and manage 3 loading bays with registration, time limits, and admin approval.

## Features

- **User registration & login**
- **3 loading bays** (Bay 1, 2, 3) with identification photos — accessible **24/7**
- **Max 4 hours** per booking
- **Max 2 bookings per person per day**
- Extra bookings allowed as separate requests (still within the daily limit)
- **Admin approve / reject** workflow
- Day schedule view for admins
- Conflict detection (no overlapping slots on the same bay)
- Data saved in browser `localStorage` (demo / single-device use)

## Colour palette

| Role | Colour | Use |
|------|--------|-----|
| Lemon yellow `#F5E642` | Primary actions, accents, active nav, badges |
| Black `#0A0A0A` | Header, footer, text, dark buttons |
| White `#FFFFFF` | Cards, forms, page background contrast |

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@dock.com` | `admin123` |
| User | Register a new account | — |

## Run locally

```bash
cd loading-dock-app
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

## How to use

1. **Register** as a user (or sign in as admin).
2. **New Booking** → pick a bay photo, date, start time, duration (1–4h), vehicle reg.
3. Booking stays **Pending** until an admin acts.
4. Sign in as **admin@dock.com** → **Approvals** → Approve or Reject.
5. Admins can also open **Schedule** for a 24-hour grid of all bays.

## Limits enforced

- Duration > 4 hours → blocked
- 3rd booking same calendar day for same user → blocked
- Overlapping time on same bay (pending or approved) → blocked
- Bookings cannot cross midnight
