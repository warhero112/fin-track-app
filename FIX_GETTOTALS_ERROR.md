# 🔧 Fix: getTotals is not a function

## Error Location
**File:** `src/components/home/RecentTransactions.tsx` (line 32)  
**Issue:** `getTotals` function is missing or not imported

---

## 🛠️ Solution

### Option 1: Add getTotals Function (Quick Fix)

Add this function to your `RecentTransactions.tsx` file:

```typescript
// At the top of RecentTransactions.tsx
const getTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const expenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    remaining: income - expenses
  };
};
```

---

### Option 2: Import from Utils (Better)

If you have a utils file, import it:

```typescript
// At the top of RecentTransactions.tsx
import { getTotals } from '@/utils/calculations';
// or
import { getTotals } from '../utils/calculations';
```

---

### Option 3: Pass as Prop

If `getTotals` should come from parent component:

**In HomeScreen.tsx:**
```typescript
import RecentTransactions from '@/components/home/RecentTransactions';

// Define getTotals in HomeScreen
const getTotals = (transactions) => {
  // ... calculation logic
  return { income, expenses, balance };
};

// Pass it to RecentTransactions
<RecentTransactions 
  transactions={transactions}
  getTotals={getTotals}
/>
```

**In RecentTransactions.tsx:**
```typescript
interface RecentTransactionsProps {
  transactions: Transaction[];
  getTotals: (transactions: Transaction[]) => {
    income: number;
    expenses: number;
    balance: number;
  };
}

export default function RecentTransactions({ 
  transactions, 
  getTotals 
}: RecentTransactionsProps) {
  const totals = getTotals(transactions);
  // ... rest of component
}
```

---

## 📝 Complete Fix Example

### Step 1: Update RecentTransactions.tsx

```typescript
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

// Add this helper function
const calculateTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const expenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    remaining: income - expenses
  };
};

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Use the local function instead of getTotals
  const totals = calculateTotals(transactions);
  
  return (
    <div>
      <h3>Recent Transactions</h3>
      <div>Income: ${totals.income}</div>
      <div>Expenses: ${totals.expenses}</div>
      <div>Balance: ${totals.balance}</div>
      
      {transactions.slice(0, 5).map(tx => (
        <div key={tx.id}>
          {tx.label}: ${tx.amount}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔍 Find the Issue

### Check these locations:

1. **RecentTransactions.tsx** - Line 32
   - Look for: `getTotals(...)`
   - Make sure function exists or is imported

2. **Check imports at top of file:**
   ```typescript
   import { getTotals } from '...'; // Is this line there?
   ```

3. **Check props:**
   ```typescript
   interface Props {
     getTotals?: (...) => ...; // Is this defined?
   }
   ```

---

## 🎯 Quick Test

After fixing, the component should work. Test by:

1. Save the file
2. Check browser (should auto-reload)
3. Error should be gone!

---

## 💡 Alternative: Use Context or Hook

If you need `getTotals` in multiple components:

**Create a hook:**

```typescript
// src/hooks/useTransactionTotals.ts
export const useTransactionTotals = (transactions: Transaction[]) => {
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const expenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  return {
    income,
    expenses,
    balance: income - expenses,
    remaining: income - expenses
  };
};
```

**Use in RecentTransactions:**

```typescript
import { useTransactionTotals } from '@/hooks/useTransactionTotals';

export default function RecentTransactions({ transactions }) {
  const totals = useTransactionTotals(transactions);
  
  return (
    <div>
      <p>Balance: ${totals.balance}</p>
    </div>
  );
}
```

---

## 🔄 After Fix

Reload your app and the error should be gone!

If you still see issues, share the code from:
- `RecentTransactions.tsx` (around line 32)
- `HomeScreen.tsx` (where RecentTransactions is used)

---

**Which solution do you want to try?**
