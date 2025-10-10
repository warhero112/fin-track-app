# 🗺️ FinTrack - Available Routes & Pages

## 📍 Application Routes

### FinTrack Pages (New! ✨)

| Route | Component | Description |
|-------|-----------|-------------|
| `/fintrack` | `FinTrack.tsx` | **Main FinTrack App** - Full personal finance management |
| `/demo` | `GlobalMoneyFlowDemo.tsx` | **Globe Animation Demo** - Interactive 3D globe showcase |

### Original Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` | Home - Real estate landing page |
| `/properties` | `properties/page.tsx` | Properties listing |
| `/properties/[id]` | `properties/[id]/page.tsx` | Property details |
| `/admin` | `admin/page.tsx` | Admin dashboard |
| `/contact` | `contact/page.tsx` | Contact page |
| `/about` | `about/page.tsx` | About page |
| `/services` | `services/page.tsx` | Services page |

---

## 🎨 FinTrack App Structure

### Main Route: `/fintrack`

**Component:** `src/app/fintrack/page.tsx`
```tsx
import FinTrack from '@/components/FinTrack';

export default function FinTrackPage() {
  return <FinTrack />;
}
```

**Features:**
- 🌍 3D Globe Loading Screen (2.5s on first load)
- 📊 5 Main Screens (Dashboard, Goals, Insights, AI, Settings)
- 💾 LocalStorage persistence
- 🌙 Dark mode support
- 🌍 6 languages, 6 currencies
- 🔄 Refresh animation

---

### Demo Route: `/demo`

**Component:** `src/app/demo/page.tsx`
```tsx
import GlobalMoneyFlowDemo from '@/components/GlobalMoneyFlowDemo';

export default function DemoPage() {
  return <GlobalMoneyFlowDemo />;
}
```

**Features:**
- 🌍 Globe-only view
- 📺 Loading screen demo
- 🔃 Refresh screen demo
- 🎮 Interactive controls
- 📊 Info panel

---

## 🗂️ Component Files

### FinTrack Components (in `src/components/`)

| File | Purpose |
|------|---------|
| `FinTrack.tsx` | Main finance app with 5 screens |
| `GlobalMoneyFlow.tsx` | 3D Earth with orbiting currencies |
| `LoadingScreen.tsx` | Full-screen loading overlay |
| `RefreshScreen.tsx` | Refresh animation overlay |
| `GlobalMoneyFlowDemo.tsx` | Interactive demo component |

---

## 🚀 How to Access Each Route

### Start Development Server:
```bash
npm run dev
```

### Then Open:

1. **FinTrack App (Main)**
   ```
   http://localhost:3000/fintrack
   ```
   - Full personal finance management
   - All features enabled
   - Data persistence

2. **Globe Demo**
   ```
   http://localhost:3000/demo
   ```
   - Interactive animation showcase
   - Control panel
   - Switch between views

3. **Home Page**
   ```
   http://localhost:3000
   ```
   - Original real estate website

---

## 📊 FinTrack App Screens

### Accessed via Bottom Navigation:

1. **Dashboard** (Tab 0)
   - Monthly overview
   - Pie chart
   - Budget progress
   - Recent transactions

2. **Goals** (Tab 1)
   - Create goals
   - Track progress
   - Color coding

3. **Insights** (Tab 2)
   - Smart insights
   - Auto-rotating
   - Category alerts

4. **AI Advisor** (Tab 3)
   - Chat interface
   - Quick suggestions
   - Financial advice

5. **Settings** (Tab 4)
   - Profile
   - Budget config
   - Language/Currency
   - Dark mode

---

## 🎯 Navigation Flow

```
Start: npm run dev
  ↓
Browser: http://localhost:3000/fintrack
  ↓
3D Globe Loading (2.5s)
  ↓
Dashboard Screen
  ↓
Bottom Nav → Switch Screens
  ↓
Top Bar → Refresh/Settings
```

---

## 🔄 Route Integration

### Adding FinTrack to Your App:

**Option 1: Dedicated Route** (Current Setup)
```tsx
// src/app/fintrack/page.tsx
import FinTrack from '@/components/FinTrack';

export default function Page() {
  return <FinTrack />;
}
```

**Option 2: Modal/Overlay**
```tsx
// Any page
import FinTrack from '@/components/FinTrack';

const [showFinTrack, setShowFinTrack] = useState(false);

{showFinTrack && (
  <div className="fixed inset-0 z-50">
    <FinTrack />
  </div>
)}
```

**Option 3: Embedded Section**
```tsx
// Part of another page
<section>
  <FinTrack />
</section>
```

---

## 📱 Mobile Access

### Local Network:

1. Find your IP:
   ```bash
   ifconfig | grep "inet " # Mac/Linux
   ipconfig                # Windows
   ```

2. Access from mobile:
   ```
   http://YOUR_IP:3000/fintrack
   http://YOUR_IP:3000/demo
   ```

---

## 🌐 Production URLs

### After Deployment:

```
https://your-domain.com/fintrack
https://your-domain.com/demo
```

---

## 📋 Quick Reference

### Development:
```bash
npm run dev
```

### Routes:
- ✨ `/fintrack` - Main app
- 🌍 `/demo` - Globe demo
- 🏠 `/` - Home page

### Components:
- Main: `FinTrack.tsx`
- Globe: `GlobalMoneyFlow.tsx`
- Demo: `GlobalMoneyFlowDemo.tsx`

---

## 🎊 Summary

**You now have:**
- ✅ FinTrack app at `/fintrack`
- ✅ Globe demo at `/demo`
- ✅ Original site at `/`
- ✅ All routes working
- ✅ Ready to use!

**Just run:**
```bash
npm run dev
```

**And visit:**
```
http://localhost:3000/fintrack
```

---

**Happy Finance Tracking! 💰🚀**
