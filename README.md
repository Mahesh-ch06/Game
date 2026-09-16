# Secret Word Room

> Real-Time Multiplayer Social Deduction & Party Games on the Web. Zero downloads, instant room codes, 5,000+ curated word pairs, and fair server-side role distribution.

**Live Application**: [https://secret-word-room.vercel.app](https://secret-word-room.vercel.app)

---

## Features

- **Instant Zero-Install Play**: Jump straight into games from any mobile browser, tablet, or desktop with a 5-letter room code.
- **Fair Server-Side State**: All roles, imposter selections, and secrets are generated and validated on secure servers to prevent client-side inspection.
- **Curated Content Library**: 5,000+ vetted, family-friendly word pairs categorized across 14 diverse themes.
- **Multiple Game Modes**:
  - **Odd One Out**: Everyone receives the same secret word, except the imposter who receives a subtly different one.
  - **Word Chameleon**: Normal players get the secret word; the Chameleon receives only a category hint and must bluff to survive.
  - **Mafia**: The classic social deduction game with night eliminations, doctor saves, and daytime town votes.
- **Audited & Compliant**: Comprehensive GDPR/CCPA cookie consent, full privacy policy, terms of service, and AdSense readiness.

---

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) & [React 19](https://react.dev)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State & Data**: [TanStack Query](https://tanstack.com/query)
- **Realtime / Database**: [Supabase](https://supabase.com)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with Liquid Glass theme
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Deployment**: [Vercel](https://vercel.com) (SSR & Serverless Nitro Preset)

---

## Local Development

### Prerequisites

- Node.js 20+ (recommended v22+)
- npm or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Mahesh-ch06/Game.git
cd Game

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Production Build

```bash
# Build for Vercel
npm run build:vercel

# Deploy prebuilt output to Vercel production
npx vercel deploy --prebuilt --prod
```

---

## Contact & Support

For questions, feedback, or publisher inquiries:
- **Email**: [codeversestudio8@gmail.com](mailto:codeversestudio8@gmail.com)
- **Website**: [https://secret-word-room.vercel.app](https://secret-word-room.vercel.app)
