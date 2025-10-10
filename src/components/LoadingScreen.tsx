'use client';

import React from 'react';
import GlobalMoneyFlow from './GlobalMoneyFlow';

interface LoadingScreenProps {
  message?: string;
  size?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading FinTrack...',
  size = 300,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <GlobalMoneyFlow size={size} showText={true} loadingText={message} />
    </div>
  );
};

export default LoadingScreen;
