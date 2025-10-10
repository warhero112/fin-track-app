# 🚀 FinTrack App - Setup & Run Guide

## Quick Start (TL;DR)

```bash
# 1. Install dependencies (already done!)
npm install

# 2. Run the development server
npm run dev

# 3. Open your browser to:
# - FinTrack App: http://localhost:3000/fintrack
# - Globe Demo: http://localhost:3000/demo
```

---

## 📋 Prerequisites

Before running the app, make sure you have:

- ✅ **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- ✅ **npm** 7.x or higher (comes with Node.js)
- ✅ **Modern browser** (Chrome, Firefox, Safari, Edge)

Check your versions:
```bash
node --version  # Should be v16+ 
npm --version   # Should be v7+
```

---

## 📦 Installation Steps

### Step 1: Dependencies Already Installed! ✅

The required packages have already been installed:
- ✅ React & Next.js
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Lucide React (icons)
- ✅ Recharts (charts)
- ✅ Framer Motion (animations)

If you need to reinstall:
```bash
npm install
```

---

## 🎯 Running the App

### Option 1: Development Mode (Recommended)

```bash
npm run dev
```

**Then open your browser to:**

1. **FinTrack App (Main)**  
   👉 http://localhost:3000/fintrack
   - Full personal finance management app
   - 3D globe loading screen
   - All features included

2. **Globe Animation Demo**  
   👉 http://localhost:3000/demo
   - Interactive demo of the 3D globe
   - Switch between different views
   - Control panel included

3. **Home Page (Original)**  
   👉 http://localhost:3000
   - Your original real estate website

### Option 2: Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

Then visit: http://localhost:3000/fintrack

---

## 🌐 Available Routes

| Route | Description |
|-------|-------------|
| `/fintrack` | 💰 **FinTrack App** - Main finance management app |
| `/demo` | 🌍 **Globe Demo** - Interactive 3D globe animation |
| `/` | 🏠 Home - Original real estate website |
| `/properties` | 🏢 Properties listing |
| `/admin` | 🔐 Admin panel |
| `/contact` | 📧 Contact page |
| `/about` | ℹ️ About page |
| `/services` | 🛠️ Services page |

---

## 🎨 FinTrack Features

### What You'll See:

1. **🌍 3D Globe Loading Screen** (2.5 seconds)
   - Rotating Earth with continents
   - 24 orbiting currency symbols
   - Beautiful gradient effects
   - Auto-loads your data

2. **📊 Dashboard**
   - Monthly spending overview
   - Income vs. Expenses
   - Interactive pie chart
   - Budget progress bar
   - Recent transactions

3. **🎯 Goals**
   - Create financial goals
   - Visual progress tracking
   - Color-coded indicators

4. **💡 Insights**
   - Smart financial insights
   - Auto-rotating carousel
   - Category alerts
   - Budget status

5. **🤖 AI Advisor**
   - Chat with AI
   - Financial advice
   - Quick suggestions

6. **⚙️ Settings**
   - 6 languages (EN, ES, FR, DE, ZH, JA)
   - 6 currencies (USD, EUR, GBP, JPY, CNY, INR)
   - Dark mode toggle
   - Budget configuration

---

## 🎬 How to Use FinTrack

### First Time Setup:

1. **Launch the app:**
   ```bash
   npm run dev
   ```
   
2. **Open FinTrack:**  
   Navigate to http://localhost:3000/fintrack

3. **Watch the loading animation** (first time)
   - Beautiful 3D globe appears
   - Currencies orbit around Earth
   - Lasts 2.5 seconds

4. **Start using the app:**
   - Click "+" button to add transactions
   - Set your monthly budget in Settings
   - Create financial goals
   - Chat with AI advisor

### Adding Your First Transaction:

1. Click the **"+"** button (top right)
2. Fill in:
   - Amount (e.g., 25.50)
   - Category (e.g., "Food & Dining")
   - Description (e.g., "Lunch at cafe")
   - Date
   - Type (Expense or Income)
3. Click **"Add"**
4. See it appear in Dashboard!

### Creating a Goal:

1. Go to **Goals** tab (bottom nav)
2. Click **"+ Add Goal"**
3. Enter:
   - Goal name (e.g., "Emergency Fund")
   - Target amount (e.g., 10000)
   - Pick a color
4. Click **"Create"**
5. Watch your progress!

---

## 🔄 Refresh Feature

### Manual Refresh:

1. Click the **refresh icon** (top bar, any screen)
2. Watch the globe animation (2 seconds)
3. Data syncs automatically

### What Gets Refreshed:

- Transaction calculations
- Budget updates
- Goal progress
- Insights refresh
- Chart data

---

## 🌙 Dark Mode

### Enable Dark Mode:

**Method 1:** Click moon/sun icon (top bar)  
**Method 2:** Go to Settings → Toggle dark mode

**Features:**
- Smooth transition
- All screens adapted
- Saves preference
- Beautiful in dark!

---

## 🌍 Change Language & Currency

### Language:

1. Go to **Settings** tab
2. Select **Language** dropdown
3. Choose from:
   - English
   - Español
   - Français
   - Deutsch
   - 中文
   - 日本語

### Currency:

1. Go to **Settings** tab
2. Select **Currency** dropdown
3. Choose from:
   - USD ($)
   - EUR (€)
   - GBP (£)
   - JPY (¥)
   - CNY (¥)
   - INR (₹)

4. Click **"Save Settings"**

---

## 💾 Data Storage

### Where Data is Saved:

Your data is stored **locally** in your browser:
- **Transactions:** `localStorage.fintrack_transactions`
- **Goals:** `localStorage.fintrack_goals`
- **Settings:** `localStorage.fintrack_settings`

### Privacy:
- ✅ 100% local (no servers)
- ✅ No tracking
- ✅ No accounts needed
- ✅ Works offline
- ✅ Instant use

### Clear Data:

**Option 1:** Browser DevTools
1. Open DevTools (F12)
2. Go to Application/Storage
3. Clear localStorage

**Option 2:** Delete transactions individually
- Click trash icon on each transaction

---

## 🐛 Troubleshooting

### Common Issues & Solutions:

#### 1. **App not loading?**
```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

#### 2. **Port 3000 already in use?**
```bash
# Use different port
PORT=3001 npm run dev
# Then visit: http://localhost:3001/fintrack
```

#### 3. **Globe animation not showing?**
- Check browser console (F12)
- Ensure JavaScript enabled
- Try clearing cache (Ctrl+Shift+R)
- Update to modern browser

#### 4. **Dark mode not working?**
- Check Tailwind config
- Ensure `dark:` classes present
- Clear localStorage
- Refresh page

#### 5. **Charts not displaying?**
- Recharts installed? `npm list recharts`
- Check console for errors
- Add some transactions first

#### 6. **Data not persisting?**
- Check localStorage enabled
- Browser in private mode?
- Check browser permissions

---

## 🔧 Development Tips

### Hot Reload:

The app automatically reloads when you edit:
- ✅ Components (src/components/*.tsx)
- ✅ Pages (src/app/**/page.tsx)
- ✅ Styles (globals.css)

### Project Structure:

```
src/
├── app/
│   ├── fintrack/
│   │   └── page.tsx          # FinTrack route
│   └── demo/
│       └── page.tsx          # Demo route
├── components/
│   ├── FinTrack.tsx          # Main app ⭐
│   ├── GlobalMoneyFlow.tsx   # 3D globe ⭐
│   ├── LoadingScreen.tsx     # Loader ⭐
│   ├── RefreshScreen.tsx     # Refresh ⭐
│   └── GlobalMoneyFlowDemo.tsx # Demo ⭐
```

### Key Files:

- **FinTrack.tsx** - Main finance app component
- **GlobalMoneyFlow.tsx** - 3D globe animation
- **LoadingScreen.tsx** - Loading overlay
- **RefreshScreen.tsx** - Refresh overlay

---

## 📱 Mobile Testing

### Test on Mobile:

1. **Find your local IP:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```

3. **Open on mobile:**
   - Visit: `http://YOUR_IP:3000/fintrack`
   - Example: `http://192.168.1.100:3000/fintrack`

### Mobile Features:
- ✅ Touch optimized
- ✅ Swipe gestures ready
- ✅ Responsive layout
- ✅ Bottom navigation
- ✅ Full-screen modals

---

## 🚀 Deployment

### Deploy to Vercel (Recommended):

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add FinTrack app"
   git push
   ```

2. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy automatically
   - Visit: `https://your-app.vercel.app/fintrack`

### Deploy to Netlify:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Drag `.next` folder to Netlify
   - Or use Netlify CLI

---

## 📊 Performance Monitoring

### Check Performance:

1. **Open Chrome DevTools** (F12)
2. **Go to Performance tab**
3. **Record session**
4. **Check metrics:**
   - FPS (should be 60)
   - CPU usage (< 10%)
   - Memory (< 50MB)

### Optimize if Needed:

- Reduce animation complexity
- Limit transaction count
- Clear old data
- Use production build

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Install missing package
npm install <package-name>

# Update dependencies
npm update

# Clear Next.js cache
rm -rf .next
```

---

## 🌟 Next Steps

### After Running the App:

1. ✅ **Explore all 5 screens** (Dashboard, Goals, Insights, AI, Settings)
2. ✅ **Add some transactions** to see charts populate
3. ✅ **Create a financial goal** and track progress
4. ✅ **Chat with AI advisor** for tips
5. ✅ **Try dark mode** toggle
6. ✅ **Change language/currency** to test i18n
7. ✅ **Click refresh** to see globe animation
8. ✅ **Check the demo** at `/demo` route

### Customize:

- Modify colors in components
- Adjust globe size
- Change animation speeds
- Add custom categories
- Extend AI responses

---

## 📚 Documentation

### Available Docs:

1. **[FINTRACK_FEATURES.md](FINTRACK_FEATURES.md)** - All features
2. **[GLOBAL_MONEY_FLOW_DOCS.md](GLOBAL_MONEY_FLOW_DOCS.md)** - Globe animation
3. **[FINTRACK_IMPLEMENTATION_GUIDE.md](FINTRACK_IMPLEMENTATION_GUIDE.md)** - Implementation
4. **[FINTRACK_README.md](FINTRACK_README.md)** - Overview
5. **[SETUP_AND_RUN_GUIDE.md](SETUP_AND_RUN_GUIDE.md)** - This file

---

## ✅ Final Checklist

Before using FinTrack:

- [x] Node.js installed (v16+)
- [x] Dependencies installed (`npm install`)
- [x] Dev server running (`npm run dev`)
- [x] Browser open to http://localhost:3000/fintrack
- [x] Globe animation loads
- [x] All features accessible

---

## 🆘 Need Help?

### Resources:

1. **Check docs** - Read documentation files
2. **Console logs** - Open DevTools (F12)
3. **Component code** - Review src/components
4. **Test demo** - Visit `/demo` route

### Common URLs:

- **FinTrack:** http://localhost:3000/fintrack
- **Demo:** http://localhost:3000/demo
- **Home:** http://localhost:3000

---

## 🎊 You're All Set!

Your FinTrack app is ready to use! 🚀

### What to do now:

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000/fintrack
   ```

3. **Enjoy the beautiful 3D globe and start managing your finances!** 💰🌍

---

<div align="center">

**Happy Finance Tracking! 💸✨**

Built with ❤️ for beautiful money management

</div>
