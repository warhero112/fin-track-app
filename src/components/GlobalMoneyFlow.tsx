'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Globe } from 'lucide-react';

interface GlobalMoneyFlowProps {
  size?: number;
  showText?: boolean;
  loadingText?: string;
}

const GlobalMoneyFlow: React.FC<GlobalMoneyFlowProps> = ({
  size = 300,
  showText = true,
  loadingText = 'Loading your finances...',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Currency symbols from around the world
  const currencies = ['$', '€', '£', '¥', '₹', '₽', '₩', '₪', '₦', '₵', '฿', 'R$'];

  // Generate money flow particles
  const moneyParticles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    symbol: currencies[i % currencies.length],
    delay: i * 0.15,
    duration: 3 + (i % 3),
    size: 16 + (i % 3) * 4,
    orbit: i % 3,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors">
      {/* Main Container */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-pulse" />

        {/* Rotating Ring 1 */}
        <div className="absolute inset-0 animate-spin-slow">
          <div className="w-full h-full rounded-full border-2 border-dashed border-blue-400/30 dark:border-blue-500/30" />
        </div>

        {/* Rotating Ring 2 */}
        <div className="absolute inset-0 animate-spin-reverse" style={{ animationDuration: '20s' }}>
          <div className="w-full h-full rounded-full border-2 border-dashed border-purple-400/30 dark:border-purple-500/30" />
        </div>

        {/* 3D Earth Sphere */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative animate-float"
            style={{
              width: size * 0.6,
              height: size * 0.6,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Earth Sphere - Main */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 shadow-2xl animate-rotate-3d">
              {/* Continents Pattern Overlay */}
              <div className="absolute inset-0 rounded-full opacity-40">
                {/* Simplified continent shapes using gradients */}
                <div className="absolute top-1/4 left-1/4 w-16 h-12 bg-green-600 rounded-full blur-sm" />
                <div className="absolute top-1/3 right-1/4 w-20 h-16 bg-green-600 rounded-full blur-sm" />
                <div className="absolute bottom-1/3 left-1/3 w-14 h-10 bg-green-600 rounded-full blur-sm" />
                <div className="absolute top-1/2 right-1/3 w-12 h-14 bg-green-600 rounded-full blur-sm" />
              </div>

              {/* Ocean Shine Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer" />

              {/* Globe Grid Lines */}
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white/10" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20" />
              <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-white/10" />

              {/* Center Globe Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe className="text-white/80" size={size * 0.15} strokeWidth={1.5} />
              </div>

              {/* 3D Shadow/Depth */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/40" />
            </div>

            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/30 to-blue-600/30 blur-xl" />
          </div>
        </div>

        {/* Orbiting Money Particles */}
        {moneyParticles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute inset-0 animate-orbit-${particle.orbit}`}
            style={{
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `float ${2 + (particle.id % 2)}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            >
              <div
                className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 text-white font-bold shadow-lg animate-pulse-slow"
                style={{
                  width: particle.size,
                  height: particle.size,
                  fontSize: particle.size * 0.6,
                  animationDelay: `${particle.delay}s`,
                }}
              >
                {particle.symbol}
                {/* Particle Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 opacity-50 blur-md animate-ping" style={{ animationDuration: '2s', animationDelay: `${particle.delay}s` }} />
              </div>

              {/* Money Trail Effect */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400/60 to-transparent blur-sm"
                style={{
                  transform: `translate(-50%, -50%) rotate(${particle.id * 15}deg)`,
                }}
              />
            </div>
          </div>
        ))}

        {/* Data Flow Lines (Curved Paths) */}
        {[0, 1, 2, 3].map((i) => (
          <svg
            key={`path-${i}`}
            className="absolute inset-0 w-full h-full animate-dash"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <path
              d={`M ${size * 0.2} ${size * 0.5} Q ${size * 0.5} ${size * (0.2 + i * 0.15)} ${size * 0.8} ${size * 0.5}`}
              fill="none"
              stroke="url(#gradient-${i})"
              strokeWidth="2"
              strokeDasharray="10,5"
              opacity="0.6"
            />
            <defs>
              <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ))}

        {/* Particle Burst Effect */}
        <div className="absolute inset-0 animate-pulse-slow" style={{ animationDuration: '3s' }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={`burst-${i}`}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${size * 0.4}px)`,
                opacity: 0.3,
                animation: `pulse 2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      {showText && (
        <div className="mt-12 space-y-4 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            {loadingText}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="text-green-500 animate-bounce" size={20} />
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Syncing global financial data
            </p>
          </div>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      {showText && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress" />
        </div>
      )}

      {/* Floating Currency Stats */}
      <div className="absolute top-10 left-10 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400">Global Sync</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            99.9%
          </div>
        </div>
      </div>

      <div className="absolute top-10 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400">Live Markets</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            150+
          </div>
        </div>
      </div>

      {/* Add required CSS animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes rotate-3d {
          0% {
            transform: rotateY(0deg) rotateX(10deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(10deg);
          }
        }

        @keyframes orbit-0 {
          from {
            transform: rotate(0deg) translateX(${size * 0.45}px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(${size * 0.45}px) rotate(-360deg);
          }
        }

        @keyframes orbit-1 {
          from {
            transform: rotate(120deg) translateX(${size * 0.5}px) rotate(-120deg);
          }
          to {
            transform: rotate(480deg) translateX(${size * 0.5}px) rotate(-480deg);
          }
        }

        @keyframes orbit-2 {
          from {
            transform: rotate(240deg) translateX(${size * 0.4}px) rotate(-240deg);
          }
          to {
            transform: rotate(600deg) translateX(${size * 0.4}px) rotate(-600deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-rotate-3d {
          animation: rotate-3d 20s linear infinite;
        }

        .animate-orbit-0 {
          animation: orbit-0 8s linear infinite;
        }

        .animate-orbit-1 {
          animation: orbit-1 10s linear infinite;
        }

        .animate-orbit-2 {
          animation: orbit-2 12s linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }

        .animate-dash {
          animation: dash 2s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GlobalMoneyFlow;
