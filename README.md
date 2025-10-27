# NBA Analytics - Player Comparison App

A Next.js application for comparing NBA player statistics using the balldontlie API.

## 🚀 Live Demo

**[View Live Application →](https://nba-analytics-sigma.vercel.app/)**

Try it out: Compare up to 5 NBA players with interactive statistics, radar charts, and auto-generated insights!

## Features

- **Advanced Search**: Search NBA players by name with position filters (Guards, Forwards, Centers)
- **Multiple Player Comparison**: Compare up to 5 players side-by-side
- **Smart Insights**: Auto-generated comparison insights showing leaders in key stats
- **Interactive Stats Table**: 
  - Sortable columns (click to sort by any stat)
  - Hover tooltips with stat explanations
  - Responsive design
- **Visual Analytics**: Interactive radar charts for easy comparison
- **Beautiful UI**: Dark gradient theme with glassmorphism effects
- **Real-time Updates**: Debounced search with loading states

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn installed
- (Optional) balldontlie.io API key for real data

### Installation

1. **Optional: Add API Key for Real Data**
   
   If you want to use real NBA data instead of mock data:
   
   ```bash
   # Create .env.local file
   echo "BALLDONTLIE_API_KEY=your_api_key_here" > .env.local
   ```
   
   Get your free API key from: https://www.balldontlie.io/
   - Free tier: 5 requests/minute
   - Plans start at $9.99/month for more requests

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/                  # Next.js API routes (proxy to balldontlie)
│   │   ├── players/route.ts
│   │   └── season-averages/route.ts
│   ├── globals.css           # Tailwind CSS styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main comparison page
├── components/
│   ├── ui/                   # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   └── tooltip.tsx
│   ├── ComparisonInsights.tsx # Auto-generated insights
│   ├── PlayerSearch.tsx      # Search with position filters
│   ├── StatsTable.tsx        # Sortable comparison table
│   └── RadarChartComparison.tsx # Radar chart visualization
├── lib/
│   ├── api.ts                # API helpers
│   └── utils.ts              # Utility functions
└── package.json
```

## Features Explained

### Advanced Player Search
- **Debounced search** (300ms) to avoid excessive API calls
- **Position filters**: Filter by Guards (G), Forwards (F), or Centers (C)
- Filters out already selected players
- Maximum 5 players can be selected
- Real-time search results display
- Beautiful gradient player cards with hover effects

### Comparison Insights
- **Auto-generated insights** showing:
  - Leading scorer
  - Top assist leader
  - Rebounding leader
  - Most careful with the ball (lowest turnovers)
- Color-coded insight cards with icons
- Updates dynamically as you select players

### Interactive Statistics Table
- **Sortable columns**: Click any stat header to sort players
- **Hover tooltips**: Detailed explanations for each stat
  - Points Per Game (PPG)
  - Rebounds Per Game (RPG)
  - Assists Per Game (APG)
  - Field Goal %, 3-Point %, Free Throw %
- **Visual indicators**: Sort direction arrows
- Season averages for 2024

### Radar Chart Visualization
- **Interactive radar chart** using Recharts
- Compares up to 5 players visually
- Shows: PTS, REB, AST, STL, BLK, TOV (turnovers inverted)
- **Color-coded** for easy distinction
- **Dynamic sizing** and opacity based on number of players
- Responsive design with custom styling

## Deployment

This app is ready to deploy on [Vercel](https://vercel.com).

1. Push your code to GitHub
2. Import the repository on Vercel
3. Deploy!

No additional configuration needed - Vercel will detect Next.js automatically.

**Note:** If you want to use real API data on Vercel:
1. Add your `BALLDONTLIE_API_KEY` environment variable in Vercel project settings
2. Redeploy your app

