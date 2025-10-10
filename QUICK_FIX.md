# ⚡ Quick Fix for Windows

## Your Error: `Missing script: "dev"`

**This means your `package.json` doesn't have the dev script.**

---

## 🔧 Quick Solution (2 Minutes)

### Step 1: Check if you have `package.json`

In your folder: `C:\Users\callo\Desktop\fintrack-cursor-monitor-user-activity-bd91`

Run this command:
```bash
dir package.json
```

---

## Option A: If you HAVE package.json

### 1. Open `package.json` in Notepad

### 2. Find the "scripts" section and make it look like this:

```json
{
  "name": "fintrack-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.5.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "lucide-react": "^0.294.0",
    "recharts": "^2.12.7"
  }
}
```

### 3. Save the file

### 4. Run:
```bash
npm install
npm run dev
```

---

## Option B: If you DON'T have package.json

### You need to create a Next.js project first!

```bash
npx create-next-app@latest . --typescript --tailwind --app
```

Then install extra packages:
```bash
npm install lucide-react recharts
```

Then copy the FinTrack components to your project.

---

## ❓ Which do you have?

**Check your folder and tell me:**
- Do you have `package.json`? (YES/NO)
- Do you have a `src` folder? (YES/NO)
- Do you have `next.config.js`? (YES/NO)

If all NO → Use **Option B**
If any YES → Use **Option A**

---

## 🎯 After fixing, run:

```bash
npm run dev
```

Then visit: `http://localhost:3000/fintrack`
