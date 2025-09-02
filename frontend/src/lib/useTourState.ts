'use client';

import { useState, useEffect } from 'react';

export function useTourState() {
  const [hasCompletedTour, setHasCompletedTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tour-completed');
    setHasCompletedTour(!!tourCompleted);
  }, []);

  const markTourCompleted = () => {
    localStorage.setItem('tour-completed', 'true');
    setHasCompletedTour(true);
  };

  return {
    hasCompletedTour,
    markTourCompleted,
  };
}
