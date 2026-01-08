# DevEvents

The Hub for Every Dev Event You Can't Miss — Hackathons, Meetups, and Conferences, All in One Place.

🔗 **Live Demo:** [https://dev-events-five-plum.vercel.app](https://dev-events-five-plum.vercel.app)

## Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router, Server Components, and caching
- **React 19** — Latest React with concurrent features
- **TypeScript** — Type-safe development
- **Tailwind CSS 4** — Utility-first styling with `tw-animate-css` for animations
- **Lucide React** — Icon library
- **ReactBits** — Library for light ray visual effects

### Backend
- **Next.js API Routes** — RESTful API endpoints
- **MongoDB + Mongoose** — Database and ODM
- **ImageKit** — Image upload, storage, and CDN delivery

### Analytics
- **PostHog** — Product analytics with event tracking and error monitoring

### Deployment
- **Vercel** — Hosting and CI/CD

## Features

- 📅 Browse developer events (hackathons, meetups, conferences)
- 🔍 View event details including agenda, venue, and organizer info
- ➕ Create new events with image upload
- 🎯 Event filtering by mode (online/offline/hybrid)
- 📊 Analytics tracking for user interactions
- ✨ Animated light ray background effects

## Project Structure

```
dev-events/
├── app/
│   ├── api/
│   │   ├── events/          # Events CRUD endpoints
│   │   └── upload-auth/     # ImageKit auth endpoint
│   ├── events/[slug]/       # Dynamic event detail pages
│   ├── layout.tsx           # Root layout with fonts and navbar
│   └── page.tsx             # Homepage with featured events
├── components/
│   ├── BookEvent.tsx        # Event booking component
│   ├── EventCard.tsx        # Event card display
│   ├── EventDetails.tsx     # Event detail view
│   ├── ExploreBtn.tsx       # CTA button
│   ├── LightRays.tsx        # WebGL background effect
│   └── Navbar.tsx           # Navigation bar
├── database/
│   ├── event.model.ts       # Event Mongoose schema
│   ├── booking.model.ts     # Booking Mongoose schema
│   └── index.ts             # Database exports
├── lib/
│   ├── actions/             # Server actions
│   ├── mongodb.ts           # Database connection
│   ├── constants.ts         # App constants
│   └── utils.ts             # Utility functions
└── instrumentation-client.ts # PostHog initialization
```

## Getting Started

### Prerequisites

- Node.js 22+ 
- npm or yarn
- MongoDB instance (local or Atlas)
- ImageKit account
- PostHog account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bruce-mig/dev-events.git
   cd dev-events
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # App
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # MongoDB
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

   # ImageKit
   IMAGEKIT_PUBLIC_KEY=your_public_key
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

   # PostHog (optional)
   NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | Fetch all events |
| `POST` | `/api/events` | Create a new event |
| `GET` | `/api/events/[slug]` | Fetch event by slug |
| `GET` | `/api/upload-auth` | Get ImageKit auth token |

## Deployment

The app is deployed on Vercel with automatic deployments from the `main` branch.

### Environment Variables on Vercel

Add the following environment variables in your Vercel project settings:

- `NEXT_PUBLIC_BASE_URL` — Your production URL
- `MONGODB_URI` — MongoDB connection string
- `IMAGEKIT_PUBLIC_KEY` — ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key  
- `IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project key
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog host URL

## License

This project is open source under the [MIT License](LICENSE).