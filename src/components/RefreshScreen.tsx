'use client';

import React, { useEffect } from 'react';
import GlobalMoneyFlow from './GlobalMoneyFlow';

interface RefreshScreenProps {
  onComplete?: () => void;
  duration?: number;
  message?: string;
}

const RefreshScreen: React.FC<RefreshScreenProps> = ({
  onComplete,
  duration = 2000,
  message = 'Refreshing your finances...',
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 animate-fade-in">
      <GlobalMoneyFlow size={250} showText={true} loadingText={message} />
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default RefreshScreen;
