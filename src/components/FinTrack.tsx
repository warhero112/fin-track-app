'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Lightbulb,
  Bot,
  Settings,
  Plus,
  Send,
  X,
  Moon,
  Sun,
  Trash2,
  Home,
  ShoppingCart,
  Utensils,
  Car,
  Film,
  Heart,
  Briefcase,
  GraduationCap,
  Plane,
  Zap,
  TrendingDown,
  DollarSign,
  Calendar,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

// Constants
const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Bills & Utilities',
  'Education',
  'Travel',
  'Other',
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const CATEGORY_COLORS = {
  'Food & Dining': '#FF6B6B',
  'Shopping': '#4ECDC4',
  'Transportation': '#45B7D1',
  'Entertainment': '#FFA07A',
  'Healthcare': '#98D8C8',
  'Bills & Utilities': '#F7DC6F',
  'Education': '#BB8FCE',
  'Travel': '#85C1E2',
  'Other': '#95A5A6',
};

// Types
interface Transaction {
  id: string;
  amount: number;
  category: string;
  label: string;
  date: string;
  type: 'income' | 'expense';
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
}

interface Settings {
  name: string;
  language: string;
  currency: string;
  darkMode: boolean;
  monthlyBudget: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const FinTrack: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [settings, setSettings] = useState<Settings>({
    name: 'User',
    language: 'en',
    currency: 'USD',
    darkMode: false,
    monthlyBudget: 3000,
  });

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);

  // AI Chat State
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI Financial Advisor. How can I help you manage your finances today?',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [transactionForm, setTransactionForm] = useState({
    id: '',
    amount: '',
    category: CATEGORIES[0],
    label: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
  });

  const [goalForm, setGoalForm] = useState({
    name: '',
    target: '',
    color: '#007aff',
  });

  // Quick AI Suggestions
  const quickSuggestions = [
    'Analyze my spending',
    'Budget tips',
    'Savings plan',
    'Investment advice',
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('fintrack_transactions');
    const savedGoals = localStorage.getItem('fintrack_goals');
    const savedSettings = localStorage.getItem('fintrack_settings');

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_goals', JSON.stringify(goals));
  }, [goals]);

  // Rotate insights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsightIndex((prev) => (prev + 1) % generateSmartInsights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Translations
  const translations: Record<string, Record<string, string>> = {
    en: {
      dashboard: 'Dashboard',
      goals: 'Goals',
      insights: 'Insights',
      aiAdvisor: 'AI Advisor',
      settings: 'Settings',
      monthlySpending: 'Monthly Spending',
      budgetUsed: 'Budget Used',
      left: 'left',
      recentTransactions: 'Recent Transactions',
      addTransaction: 'Add Transaction',
      editTransaction: 'Edit Transaction',
      addGoal: 'Add Goal',
      expense: 'Expense',
      income: 'Income',
      amount: 'Amount',
      category: 'Category',
      description: 'Description',
      date: 'Date',
      add: 'Add',
      update: 'Update',
      cancel: 'Cancel',
      profile: 'Profile',
      displayName: 'Display Name',
      regionalSettings: 'Regional Settings',
      language: 'Language',
      currency: 'Currency',
      saveSettings: 'Save Settings',
      settingsSaved: 'Settings saved successfully!',
      goalName: 'Goal Name',
      targetAmount: 'Target Amount',
      color: 'Color',
      create: 'Create',
    },
  };

  const t = (key: string) => {
    return translations[settings.language]?.[key] || translations['en'][key] || key;
  };

  // Currency Formatting
  const formatCurrency = (amount: number) => {
    const currencyData = CURRENCIES.find((c) => c.code === settings.currency);
    return `${currencyData?.symbol || '$'}${Math.abs(amount).toFixed(2)}`;
  };

  // Category Icon Helper
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Food & Dining': Utensils,
      'Shopping': ShoppingCart,
      'Transportation': Car,
      'Entertainment': Film,
      'Healthcare': Heart,
      'Bills & Utilities': Home,
      'Education': GraduationCap,
      'Travel': Plane,
      'Other': DollarSign,
    };
    return icons[category] || DollarSign;
  };

  // Calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const totals = {
    income: monthlyTransactions
      .filter((tx) => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0),
    expenses: monthlyTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0),
    get remaining() {
      return settings.monthlyBudget - this.expenses;
    },
    get usedPercent() {
      return (this.expenses / settings.monthlyBudget) * 100;
    },
  };

  // Pie Chart Data
  const expensesByCategory = monthlyTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc: Record<string, number>, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([category, value]) => ({
    name: category,
    value,
    color: CATEGORY_COLORS[category] || '#95A5A6',
  }));

  // Recent Transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Smart Insights
  const generateSmartInsights = [
    {
      title: '💰 Great Savings!',
      message: `You've saved ${formatCurrency(totals.remaining)} this month. Keep it up!`,
      color: 'green',
    },
    {
      title: '🍔 Food Spending Alert',
      message: `You spent ${formatCurrency(expensesByCategory['Food & Dining'] || 0)} on dining. Consider meal prep!`,
      color: 'orange',
    },
    {
      title: '📊 Budget Status',
      message: `You've used ${totals.usedPercent.toFixed(0)}% of your monthly budget.`,
      color: totals.usedPercent > 80 ? 'red' : 'blue',
    },
    {
      title: '🎯 Goal Progress',
      message: goals.length > 0
        ? `Your "${goals[0].name}" goal is ${((goals[0].current / goals[0].target) * 100).toFixed(0)}% complete!`
        : 'Set a financial goal to track your progress!',
      color: 'purple',
    },
    {
      title: '📈 Income Trend',
      message: `Your income this month: ${formatCurrency(totals.income)}`,
      color: 'indigo',
    },
  ];

  // Transaction Functions
  const saveTransaction = () => {
    if (!transactionForm.amount || !transactionForm.label) return;

    const transaction: Transaction = {
      id: transactionForm.id || Date.now().toString(),
      amount: parseFloat(transactionForm.amount),
      category: transactionForm.category,
      label: transactionForm.label,
      date: transactionForm.date,
      type: transactionForm.type,
    };

    if (transactionForm.id) {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === transaction.id ? transaction : tx))
      );
    } else {
      setTransactions((prev) => [...prev, transaction]);
    }

    setShowAddSheet(false);
    resetForm();
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const resetForm = () => {
    setTransactionForm({
      id: '',
      amount: '',
      category: CATEGORIES[0],
      label: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
    });
  };

  // Goal Functions
  const saveGoal = () => {
    if (!goalForm.name || !goalForm.target) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalForm.name,
      target: parseFloat(goalForm.target),
      current: 0,
      color: goalForm.color,
    };

    setGoals((prev) => [...prev, newGoal]);
    setShowAddGoalModal(false);
    resetGoalForm();
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const resetGoalForm = () => {
    setGoalForm({
      name: '',
      target: '',
      color: '#007aff',
    });
  };

  // Settings Functions
  const saveSettings = () => {
    setSavingSettings(true);
    localStorage.setItem('fintrack_settings', JSON.stringify(settings));

    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => {
      setSavingSettings(false);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    }, 500);
  };

  const toggleDarkMode = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  // AI Functions
  const handleAIMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: aiInput };
    setAiMessages((prev) => [...prev, userMessage]);
    setAiInput('');
    setAiLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Based on your spending of ${formatCurrency(totals.expenses)}, you're doing well! Consider saving ${formatCurrency(totals.remaining)} for emergencies.`,
        `I recommend allocating 50% to needs, 30% to wants, and 20% to savings. You're currently spending ${totals.usedPercent.toFixed(0)}% of your budget.`,
        `Your biggest expense is ${Object.keys(expensesByCategory)[0] || 'not tracked'}. Consider reducing this by 10-15% next month.`,
        `Great question! Building an emergency fund of 3-6 months' expenses is crucial. Start with saving ${formatCurrency(settings.monthlyBudget * 0.2)} monthly.`,
      ];

      const aiResponse: ChatMessage = {
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setAiMessages((prev) => [...prev, aiResponse]);
      setAiLoading(false);
    }, 1000);
  };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Components
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {[
          { icon: Home, label: 'Home', index: 0 },
          { icon: Target, label: 'Goals', index: 1 },
          { icon: Lightbulb, label: 'Insights', index: 2 },
          { icon: Bot, label: 'AI', index: 3 },
          { icon: Settings, label: 'Settings', index: 4 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.index;
          return (
            <button
              key={item.index}
              onClick={() => setActiveTab(item.index)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-colors"
            >
              <Icon
                size={24}
                className={isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive
                    ? 'text-blue-500 dark:text-blue-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const TopBar = ({ title, showAddBtn = false }: { title: string; showAddBtn?: boolean }) => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 pb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-blue-100 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition"
          >
            {settings.darkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-white" />}
          </button>
          {showAddBtn && (
            <button
              onClick={() => setShowAddSheet(true)}
              className="p-3 bg-white hover:bg-gray-100 rounded-full transition shadow-lg"
            >
              <Plus size={20} className="text-blue-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // AI Advisor Screen
  const AIAdvisorScreen = () => (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <TopBar title={t('aiAdvisor')} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {aiMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={20} className="text-blue-500" />
                  <span className="font-semibold text-sm">AI Advisor</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-16 left-0 right-0 bg-gray-50 dark:bg-gray-900">
        {/* Quick Suggestions */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setAiInput(suggestion)}
                className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIMessage()}
              placeholder="Ask me anything about your finances..."
              className="flex-1 px-5 py-3 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition"
            />
            <button
              onClick={handleAIMessage}
              disabled={!aiInput.trim() || aiLoading}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Insights Screen
  const InsightsScreen = () => (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <TopBar title={t('insights')} />
      <div className="p-4 space-y-5">
        {/* Featured Insight with Enhanced Design */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Lightbulb size={28} className="text-white" />
              </div>
              <span className="font-bold text-lg">Smart Insight</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">
              {generateSmartInsights[currentInsightIndex]?.title}
            </h3>
            <p className="text-white/95 text-lg leading-relaxed">
              {generateSmartInsights[currentInsightIndex]?.message}
            </p>
            <div className="flex gap-2 mt-6">
              {generateSmartInsights.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    idx === currentInsightIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Insights with Enhanced Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white px-1">
            All Insights
          </h2>
          {generateSmartInsights.map((insight, idx) => {
            const colorClasses: Record<string, string> = {
              green: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800',
              blue: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800',
              red: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800',
              orange: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800',
              purple: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800',
              indigo: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800',
            };

            const iconColorClasses: Record<string, string> = {
              green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
              blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
              red: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
              orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
              purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
              indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
            };

            return (
              <div
                key={idx}
                className={`rounded-2xl p-5 shadow-md border-2 transition-all hover:shadow-lg hover:scale-[1.02] ${
                  colorClasses[insight.color] || colorClasses.blue
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shadow-sm ${iconColorClasses[insight.color] || iconColorClasses.blue}`}>
                    <TrendingUp size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Main Dashboard Screen
  const DashboardScreen = () => (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <TopBar title={t('dashboard')} showAddBtn />

      <div className="p-4 space-y-5">
        {/* Enhanced Monthly Overview Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {t('monthlySpending')}
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totals.expenses)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ArrowDownRight size={16} className="text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  of {formatCurrency(settings.monthlyBudget)} budget
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Income
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totals.income)}
              </div>
              <div className="flex items-center gap-1 mt-2 justify-end">
                <ArrowUpRight size={16} className="text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400">+12%</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          {pieChartData.length > 0 && (
            <div className="h-56 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Enhanced Budget Progress */}
          <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('budgetUsed')}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {totals.usedPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  totals.usedPercent > 90
                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                    : totals.usedPercent > 70
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${Math.min(totals.usedPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatCurrency(totals.remaining)} {t('left')}
              </span>
              {totals.usedPercent > 90 && (
                <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                  ⚠️ Budget Alert
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions with Enhanced Design */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('recentTransactions')}
            </h3>
            <button className="text-sm font-medium text-blue-500 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <DollarSign size={48} className="mx-auto mb-3 opacity-30" />
                <p>No transactions yet. Add your first transaction!</p>
              </div>
            ) : (
              recentTransactions.map((tx) => {
                const Icon = getCategoryIcon(tx.category);
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div
                      className={`p-3 rounded-xl shadow-sm ${
                        tx.type === 'income'
                          ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                          : 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30'
                      }`}
                    >
                      <Icon
                        size={22}
                        className={
                          tx.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {tx.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-bold text-lg ${
                          tx.type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </div>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                      >
                        <Trash2 size={16} className="text-red-400 dark:text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Goals Screen with Enhanced Design
  const GoalsScreen = () => (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <TopBar title={t('goals')} />

      <div className="p-4 space-y-5">
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Plus size={24} />
          {t('addGoal')}
        </button>

        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Target size={64} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No goals yet. Set your first financial goal!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-4 h-4 rounded-full shadow-lg"
                        style={{ backgroundColor: goal.color }}
                      />
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                        {goal.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                  >
                    <Trash2 size={18} className="text-red-400 dark:text-red-500" />
                  </button>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3 overflow-hidden shadow-inner">
                  <div
                    className="h-4 rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {progress.toFixed(1)}% complete
                  </span>
                  {progress >= 100 && (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      🎉 Goal Reached!
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Settings Screen with Enhanced Design
  const SettingsScreen = () => (
    <div className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <TopBar title={t('settings')} />

      <div className="p-4 space-y-5">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
            {t('profile')}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t('displayName')}
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
            />
          </div>
        </div>

        {/* Monthly Budget */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="text-green-500" size={24} />
            Monthly Budget
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Budget Limit
            </label>
            <input
              type="number"
              value={settings.monthlyBudget}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, monthlyBudget: parseFloat(e.target.value) || 0 }))
              }
              className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
            />
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg mb-5 text-gray-900 dark:text-white">
            {t('regionalSettings')}
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('language')}
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
                className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('currency')}
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
                className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={savingSettings}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {savingSettings ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            t('saveSettings')
          )}
        </button>

        {settingsSaved && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-5 py-4 rounded-2xl text-center font-medium shadow-lg">
            ✅ {t('settingsSaved')}
          </div>
        )}
      </div>
    </div>
  );

  // Add Transaction Sheet with Enhanced Design
  const AddTransactionSheet = () => (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end transition-opacity duration-300 ${
        showAddSheet ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowAddSheet(false)}
    >
      <div
        className={`bg-white dark:bg-gray-800 w-full max-w-md mx-auto rounded-t-3xl p-6 shadow-2xl transition-transform duration-300 ${
          showAddSheet ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {transactionForm.id ? t('editTransaction') : t('addTransaction')}
          </h2>
          <button
            onClick={() => setShowAddSheet(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('amount')}
              </label>
              <input
                type="number"
                step="0.01"
                value={transactionForm.amount}
                onChange={(e) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('category')}
              </label>
              <select
                value={transactionForm.category}
                onChange={(e) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t('description')}
            </label>
            <input
              type="text"
              value={transactionForm.label}
              onChange={(e) =>
                setTransactionForm((prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              placeholder="e.g., Coffee at Starbucks"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('date')}
              </label>
              <input
                type="date"
                value={transactionForm.date}
                onChange={(e) =>
                  setTransactionForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTransactionForm((prev) => ({ ...prev, type: 'expense' }))}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    transactionForm.type === 'expense'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {t('expense')}
                </button>
                <button
                  onClick={() => setTransactionForm((prev) => ({ ...prev, type: 'income' }))}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    transactionForm.type === 'income'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {t('income')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveTransaction}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {transactionForm.id ? t('update') : t('add')}
            </button>
            <button
              onClick={() => {
                setShowAddSheet(false);
                resetForm();
              }}
              className="px-8 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add Goal Modal with Enhanced Design
  const AddGoalModal = () => (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        showAddGoalModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setShowAddGoalModal(false)}
    >
      <div
        className={`bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-6 shadow-2xl transition-transform duration-300 ${
          showAddGoalModal ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('addGoal')}</h2>
          <button
            onClick={() => setShowAddGoalModal(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t('goalName')}
            </label>
            <input
              type="text"
              value={goalForm.name}
              onChange={(e) => setGoalForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              placeholder="e.g., Emergency Fund"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {t('targetAmount')}
            </label>
            <input
              type="number"
              step="0.01"
              value={goalForm.target}
              onChange={(e) => setGoalForm((prev) => ({ ...prev, target: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none text-gray-900 dark:text-white transition"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              {t('color')}
            </label>
            <div className="flex gap-3">
              {['#007aff', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#ff2d55'].map((color) => (
                <button
                  key={color}
                  onClick={() => setGoalForm((prev) => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-xl transition-all shadow-md hover:scale-110 ${
                    goalForm.color === color
                      ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-gray-800 scale-110'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveGoal}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t('create')}
            </button>
            <button
              onClick={() => {
                setShowAddGoalModal(false);
                resetGoalForm();
              }}
              className="px-8 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {activeTab === 0 && <DashboardScreen />}
      {activeTab === 1 && <GoalsScreen />}
      {activeTab === 2 && <InsightsScreen />}
      {activeTab === 3 && <AIAdvisorScreen />}
      {activeTab === 4 && <SettingsScreen />}

      <BottomNav />
      <AddTransactionSheet />
      <AddGoalModal />
    </div>
  );
};

export default FinTrack;
