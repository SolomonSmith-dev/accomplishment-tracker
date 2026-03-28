# Accomplishment Tracker

A personal tool for logging daily work wins and generating resume bullets. Built with Next.js, TypeScript, and Prisma.

## What It Does

- Log daily accomplishments with context and impact
- Browse history of past entries
- Generate resume-ready bullet points from logged wins

## Stack

Next.js, TypeScript, Prisma, Tailwind CSS

## Setup

```bash
git clone https://github.com/SolomonSmith-dev/accomplishment-tracker
cd accomplishment-tracker
npm install
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/log` - Log a new accomplishment
- `/history` - Browse past entries
- `/resume` - Generate resume bullets from entries
