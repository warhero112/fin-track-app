# 🚀 How to Run FinTrack App

## Quick Start (3 Steps)

### 1️⃣ Install Dependencies (Already Done! ✅)
```bash
npm install
```

### 2️⃣ Start Development Server
```bash
npm run dev
```

### 3️⃣ Open Your Browser
```
✨ FinTrack App:  http://localhost:3000/fintrack
🌍 Globe Demo:    http://localhost:3000/demo
```

---

## 🎯 That's It!

You should see:
1. **Beautiful 3D Globe Animation** (2.5 seconds)
2. **FinTrack Dashboard** with all features

---

## 📱 What You Can Do:

### In FinTrack App (`/fintrack`):
- ➕ Add transactions (click "+" button)
- 🎯 Create financial goals
- 💡 View smart insights
- 🤖 Chat with AI advisor
- ⚙️ Change settings (language, currency, dark mode)
- 🔄 Refresh data (click refresh icon)

### In Globe Demo (`/demo`):
- 🌍 View 3D globe only
- 📺 See loading screen
- 🔃 Trigger refresh animation
- 🎮 Switch between views

---

## 🔄 Different Commands:

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

---

## 🌐 Access URLs:

| What | URL |
|------|-----|
| **FinTrack App** | http://localhost:3000/fintrack |
| **Globe Demo** | http://localhost:3000/demo |
| Home Page | http://localhost:3000 |

---

## 🐛 Having Issues?

### Globe not loading?
```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

### Port 3000 in use?
```bash
# Use different port
PORT=3001 npm run dev
# Then: http://localhost:3001/fintrack
```

### Missing packages?
```bash
npm install
```

---

## 📚 More Info?

See **[SETUP_AND_RUN_GUIDE.md](SETUP_AND_RUN_GUIDE.md)** for detailed instructions.

---

**That's all! Enjoy your beautiful finance app! 💰🌍✨**
