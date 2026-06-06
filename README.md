## Overview
RESTful API for managing private market funds, investors, and their investments.

## Tech Stack
| Layer | Technology |
| --- | --- |
| Language | TypeScript |
| Framework | Express |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Validation | Zod |

## Project structure
```
src/
├── server.ts              # Entry point
├── routes/
│   ├── funds.ts           # GET, POST, PUT /funds + investment routes
│   └── investors.ts       # GET, POST /investors
├── lib/
│   └── prisma.ts          # Prisma client
├── validators/            # Zod schemas for validation
│   ├── funds.ts           
│   ├── investors.ts       
│   └── investments.ts     
└── db/
    └── seed.ts            # Seed script for sample data
prisma/
├── schema.prisma          # Database schema and models
├── prisma.config.ts       # Prisma configuration and DB connection
```

## Set-up
Pre-requisites: Requires Node 18+
1. Clone the repo locally
2. Copy .env.example to .env and set `DATABASE_URL` to your Neon connection string
3. `npm install`
4. `npx prisma migrate deploy`
5. `npm run db:seed` (optional but recommended)
6. `npm run dev` (server runs on port 8000)

 
## API Endpoints
- `GET    /funds`
- `POST   /funds`
- `GET    /funds/:id`
- `PUT    /funds`
- `GET    /investors`
- `POST   /investors`
- `GET    /funds/:fund_id/investments`
- `POST   /funds/:fund_id/investments`

## Design decisions
- `target_size_usd` and `amount_usd` are stored as `NUMERIC` in PostgreSQL. Prisma returns `Decimal` values as strings to preserve precision - these are converted to `Number` at the API response boundary to match the spec contract.
- `PUT /funds` takes the fund `id` in the request body rather than the URL path. This deviates from standard REST convention (which would be `PUT /funds/:id`) but is implemented as the spec defines. Noted here as an intentional deviation.
- Prisma enum values cannot contain spaces, so `investor_type` is stored as `FamilyOffice` in the database. A Zod transform maps the incoming value `"Family Office"` to `"FamilyOffice"` on input, and `formatInvestor` maps it back on output - the space only exists at the API boundary.
- `GET /funds/:fund_id/investments` returns 404 if the fund does not exist, rather than an empty array. An empty array would falsely imply the fund exists but has no investments.
- `investment_date` is stored as DateTime in Prisma and serialised as `YYYY-MM-DD` at the response boundary to match the `string (date)` format in the spec.
- All `POST` and `PUT` request bodies are validated with Zod before touching the database, returning a 400 response on invalid input.

## How I worked with AI

Used Claude throughout as a pair-programming assistant and sounding board, in line with the task brief.

**What AI helped with**:
- Catching bugs during code review
- Generating curl commands for ad-hoc endpoint testing
- Writing the seed script boilerplate

**What I drove myself:**
- All architecture and design decisions (routing structure, validation approach, serialization strategy)
- Writing every route, validator, and formatter - understanding each piece before moving on
- Spotting and questioning the `PUT /funds` REST convention deviation
- Schema design and decisions around money types, enums, and foreign keys


The workflow throughout was: understand the problem, attempt an implementation, use AI to validate or debug rather than to generate solutions upfront.