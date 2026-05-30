# 🚀 SaaS App Monorepo

**10 Production-Ready SaaS Applications**  
Built with React + Vite + TypeScript + Turborepo

[[TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[[React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[[Turborepo](https://img.shields.io/badge/Turborepo-1.13-EF4444?logo=turborepo)](https://turbo.build/)
[[PNPM](https://img.shields.io/badge/PNPM-9.0-F69220?logo=pnpm)](https://pnpm.io/)
[[MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](#demo) • [Quick Start](#-quick-start) • [Apps](#-apps) • [Architecture](#-architecture) • [Deploy](#-deployment)


## ✨ What is this?

A batteries-included monorepo containing **10 complete SaaS applications**. Each app is production-ready with real features, not just boilerplate. Clone one app or run all 10 in parallel.

**Why this exists**: Most SaaS starters give you auth + a dashboard shell. These apps ship with kanban boards, SQL editors, real-time CRDTs, payment flows, and virtualized logs out of the box.

## 📱 Apps

|  | App | Port | Description | Key Features |
| --- | --- | --- |
| 🗂️ | **taskforge** | `5173` | Project management | Kanban, sprints, assignees, labels, dnd-kit |
| 📝 | **docsmith** | `5174` | Team wiki | Markdown editor, folder tree, AI drafts |
| 📊 | **analytica** | `5175` | Analytics platform | Drag-drop widgets, funnels, retention, Recharts |
| 📋 | **formcraft** | `5176` | Form builder | Typeform-style, logic jumps, validation, Zod |
| 📧 | **inboxzero** | `5177` | Unified inbox | Multi-channel, AI summaries, snooze, labels |
| 📜 | **logoscope** | `5178` | Log observability | Virtualized logs, filters, alerts, trace view |
| 📈 | **metriboard** | `5179` | Metrics dashboard | SQL queries, 6 chart types, drag-drop grid |
| 🗒️ | **notesync** | `5180` | Real-time notes | CodeMirror, CRDT sync, live cursors, Yjs |
| 💳 | **pos-lite** | `5181` | Point of sale | Product grid, cart, checkout, receipts |
| 📑 | **reportcraft** | `5182` | SQL reporting | SQL editor, charts, scheduled emails |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9+ `npm i -g pnpm`

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/saas-monorepo.git
cd saas-monorepo

# Install dependencies
pnpm install

# Copy env files
for dir in apps/*/; do cp "$dir.env.example" "$dir.env"; done

# Run all apps
pnpm dev
```

### Run a specific app
```bash
pnpm dev --filter=@app/taskforge
pnpm dev --filter=@app/analytica
```

Each app runs on its own port. Visit `http://localhost:5173` for taskforge, etc.

## 🏗️ Architecture

```
saas-monorepo/
├── apps/                    # 10 standalone SaaS apps
│   ├── taskforge/          # Kanban + sprints
│   ├── docsmith/           # Markdown wiki
│   ├── analytica/          # Analytics dashboards
│   ├── formcraft/          # Form builder
│   ├── inboxzero/          # Unified inbox
│   ├── logoscope/          # Log viewer
│   ├── metriboard/         # Metrics dashboard
│   ├── notesync/           # Real-time notes
│   ├── pos-lite/           # Point of sale
│   └── reportcraft/        # SQL reports
├── packages/
│   ├── ui/                 # Shared React components
│   ├── utils/              # cn(), formatCurrency(), etc
│   ├── hooks/              # useLocalStorage(), useDebounce()
│   ├── types/              # Shared TypeScript interfaces
│   └── config/             # ESLint + TSConfig presets
├── turbo.json              # Turborepo pipeline
└── package.json            # Workspace config
```

### **Shared Packages**

| Package | Description | Used By |
| --- | --- | --- |
| **`@repo/ui`** | Button, Input, Modal, Card, Badge | All apps |
| **`@repo/utils`** | `cn()`, `formatCurrency()`, `debounce()` | All apps |
| **`@repo/hooks`** | `useLocalStorage()`, `useDebounce()`, `useToggle()` | All apps |
| **`@repo/types`** | User, ApiResponse, Workspace | All apps |
| **`@repo/config`** | ESLint + TSConfig presets | All apps |

## 🛠️ Tech Stack

**Core**  
React 18 • TypeScript 5 • Vite 5 • Turborepo • pnpm Workspaces

**UI & Styling**  
Tailwind CSS • clsx • tailwind-merge • lucide-react

**State & Data**  
Zustand • TanStack Query • React Hook Form • Zod

**Specialized**  
Recharts • CodeMirror 6 • @dnd-kit • Yjs • react-window • date-fns

## 💻 Development

### Commands

```bash
pnpm dev              # Run all apps in parallel
pnpm build            # Build all apps + packages  
pnpm lint             # ESLint check
pnpm type-check       # TypeScript check
pnpm clean            # Delete dist + node_modules
```

### Add a new app
```bash
cd apps
mkdir myapp
cd myapp
pnpm init
# Copy package.json from another app, update name + port
```

### Add a shared component
```bash
# packages/ui/src/MyComponent.tsx
export function MyComponent() { ... }

# packages/ui/src/index.ts
export * from './MyComponent'

# Use in any app
import { MyComponent } from '@repo/ui'
```

### Environment Variables

Each app has `.env.example`:
```bash
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
VITE_CURRENCY=USD
VITE_TAX_RATE=0.0875
```

## 🌐 Deployment

Each app builds to static files and deploys independently:

```bash
pnpm build
# Output: apps/*/dist
```

**Deploy to Vercel/Netlify/CF Pages:**
1. Set root directory to `apps/taskforge` 
2. Build command: `cd ../.. && pnpm build --filter=@app/taskforge`
3. Output directory: `dist`
4. Set `VITE_API_URL` env var

Repeat for each app or use monorepo deploy.

## 🗄️ Backend Integration

Apps currently use `localStorage` + mock data. To go production:

| Feature | Tech | Notes |
| --- | --- | --- |
| **API** | Express / Fastify | Port `:4000` |
| **Database** | Postgres + Prisma | Per-app schema |
| **Auth** | Clerk / Auth0 / Supabase | Add to `@repo/ui` |
| **Real-time** | y-websocket | For notesync, docsmith |
| **Queue** | BullMQ + Redis | Scheduled reports/alerts |
| **Storage** | S3 / R2 | File uploads |

See `BACKEND.md` for detailed setup per app.

## 📊 App Details

<details>
<summary><b>taskforge</b> - Kanban + Sprints</summary>

- Drag-drop tasks between columns
- Sprint planning with start/end dates
- Assignees, labels, priorities, due dates
- Filters by assignee/label/status
- Built with: @dnd-kit, react-hook-form

</details>

<details>
<summary><b>analytica</b> - Analytics Dashboards</summary>

- Drag-drop widget grid via react-grid-layout
- Funnel charts, retention cohorts, line/bar/area charts
- Date range picker with presets
- Export to PNG/CSV
- Built with: Recharts, date-fns

</details>

<details>
<summary><b>pos-lite</b> - Point of Sale</summary>

- Product grid with categories
- Cart with quantity controls
- Cash/card checkout + change calculator
- Tax calculation with overrides
- Order history via localStorage
- Built with: Zustand, nanoid

</details>

<details>
<summary><b>reportcraft</b> - SQL Reports</summary>

- CodeMirror SQL editor with syntax highlighting
- 6 chart types: table, line, bar, area, pie, number
- Query results cached locally
- Cron scheduling UI for email reports
- Built with: CodeMirror, Recharts

</details>

## 🤝 Contributing

PRs welcome! Please:

1. Fork the repo
2. Create feature branch `git checkout -b feat/my-feature`
3. Run `pnpm lint && pnpm type-check`
4. Commit using conventional commits
5. Open PR

## 📝 License

MIT © 2026

---

<div align="center">

**[⬆ Back to Top](#-saas-app-monorepo)**

Built with ❤️ using Turborepo + React

</div>
```

