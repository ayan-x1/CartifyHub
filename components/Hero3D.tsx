'use client';

import React, { Suspense, useState, useEffect } from 'react';

function LoadingFallback() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading 3D Preview...</div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center">
      <div className="text-red-600 text-center">
        <div className="text-lg font-semibold mb-2">3D Preview Unavailable</div>
        <div className="text-sm">Please try refreshing the page</div>
      </div>
    </div>
  );
}

function ThreeDFallback() {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-2xl">
      <div className="text-center">
        <div className="text-4xl mb-4">🚀</div>
        <div className="text-xl font-semibold text-gray-700 mb-2">Interactive Experience</div>
        <div className="text-gray-600">Explore our products with immersive 3D previews</div>
      </div>
    </div>
  );
}

interface Hero3DProps {
  onError?: () => void;
}

export function Hero3D({ onError }: Hero3DProps) {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingFallback />;
  }

  if (hasError) {
    return <ErrorFallback />;
  }

  // For now, return the fallback until packages are properly installed
  // TODO: Replace with actual 3D component after running npm install
  return <ThreeDFallback />;
}