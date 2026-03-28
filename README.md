# Accomplishment Tracker

A personal tool for logging daily work wins and generating resume bullets. Built with Next.js, TypeScript, and Prisma.

## What It Does

- Log daily accomplishments with context and impact
- Browse history of past entries
- Generate resume-ready bullet points from logged wins

## Stack

Next.js, TypeScript, Prisma, Tailwind CSS

## Package Manager

This project uses **npm** (`package-lock.json`). Run all commands with `npm`.

## Environment Variables

Copy `.env.example` to `.env` and set the required variables:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description | Default |
|---|---|---|
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` |
| `DATABASE_URL` | Database connection string | `file:./dev.db` |

## Setup

```bash
git clone https://github.com/SolomonSmith-dev/accomplishment-tracker
cd accomplishment-tracker
cp .env.example .env   # configure environment variables
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/log` - Log a new accomplishment
- `/history` - Browse past entries
- `/resume` - Generate resume bullets from entries
