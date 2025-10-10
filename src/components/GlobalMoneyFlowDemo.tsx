'use client';

import React, { useState } from 'react';
import GlobalMoneyFlow from './GlobalMoneyFlow';
import LoadingScreen from './LoadingScreen';
import RefreshScreen from './RefreshScreen';

const GlobalMoneyFlowDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'globe' | 'loading' | 'refresh'>('globe');
  const [showRefresh, setShowRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Control Panel */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 flex gap-3">
        <button
          onClick={() => setActiveDemo('globe')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeDemo === 'globe'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Globe Only
        </button>
        <button
          onClick={() => setActiveDemo('loading')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeDemo === 'loading'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Loading Screen
        </button>
        <button
          onClick={() => {
            setActiveDemo('refresh');
            setShowRefresh(true);
          }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeDemo === 'refresh'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          Refresh Screen
        </button>
      </div>

      {/* Demo Content */}
      {activeDemo === 'globe' && (
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          <GlobalMoneyFlow size={400} showText={false} />
        </div>
      )}

      {activeDemo === 'loading' && (
        <LoadingScreen message="Loading your global finances..." size={350} />
      )}

      {activeDemo === 'refresh' && showRefresh && (
        <RefreshScreen
          message="Syncing worldwide data..."
          duration={3000}
          onComplete={() => {
            setShowRefresh(false);
            setActiveDemo('globe');
          }}
        />
      )}

      {activeDemo === 'refresh' && !showRefresh && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          <button
            onClick={() => setShowRefresh(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
          >
            Trigger Refresh Animation
          </button>
        </div>
      )}

      {/* Info Panel */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-2xl">
        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          3D Global Money Flow Animation
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>✨ <strong>24 Orbiting Currencies</strong> - Money symbols from around the world</p>
          <p>🌍 <strong>3D Rotating Earth</strong> - Animated globe with continents</p>
          <p>💫 <strong>Dynamic Particles</strong> - Pulsing and flowing money icons</p>
          <p>🎨 <strong>Gradient Effects</strong> - Beautiful multi-color gradients</p>
          <p>🌙 <strong>Dark Mode Support</strong> - Looks great in both themes</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalMoneyFlowDemo;
