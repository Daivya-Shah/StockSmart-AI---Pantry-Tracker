# StockSmart AI

StockSmart AI is a pantry tracker that uses AI to suggest recipes based on what you actually have at home. You can add items to your pantry, track their quantities and expiration dates, and get personalized recipe ideas that help you use things up before they go bad.

Built with Next.js, Firebase, and the OpenAI API.

---

## Features

- **Pantry management** - Add, remove, and update items with quantities and expiration dates
- **Smart recipe suggestions** - Click "Find Recipes" and get 3 AI-generated recipe ideas tailored to your current inventory
- **Expiring soon alerts** - A sidebar highlights anything expiring within the next 7 days, sorted by urgency
- **Low quantity alerts** - Items running below 5 units show up in a separate sidebar so you know what to restock
- **Search** - Filter your inventory by name in real time

---

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Firebase Firestore](https://firebase.google.com/docs/firestore) for the database
- [Material UI v5](https://mui.com/) for the UI
- [OpenAI API](https://platform.openai.com/) (gpt-4o-mini) for recipe generation

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- An OpenAI API key

### Installation

```bash
git clone https://github.com/your-username/StockSmart-AI-Pantry-Tracker.git
cd StockSmart-AI-Pantry-Tracker
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```
# OpenAI
OPENAI_API_KEY=

# Firebase (find these in your Firebase project settings)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

The `NEXT_PUBLIC_` prefix is required for Firebase values since they are used client-side. `OPENAI_API_KEY` is server-side only and does not need that prefix.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
app/
  page.js               # Landing page
  dashboard/
    page.js             # Main pantry dashboard
  api/
    getRecipes/
      route.js          # Server-side route for OpenAI recipe generation
firebase.js             # Firebase + Firestore initialization
```

---

## How It Works

When you add an item to your pantry, it gets saved to Firestore with its name, quantity, and expiration date. The dashboard reads from Firestore on load and updates in real time as you make changes.

When you click "Find Recipes," the app sends your full inventory list to the OpenAI API. The prompt instructs the model to prioritize ingredients that are expiring soon or in low supply, so the suggestions are actually useful rather than generic.

---

## Built By

[Daivya Shah](https://daivyashah.com/)
