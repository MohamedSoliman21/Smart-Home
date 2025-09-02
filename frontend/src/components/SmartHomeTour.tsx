'use client';

import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

interface SmartHomeTourProps {
  isFirstTime: boolean;
  onComplete: () => void;
}

export default function SmartHomeTour({ isFirstTime, onComplete }: SmartHomeTourProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (isFirstTime) {
      const timer = setTimeout(() => setRun(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Welcome to Your Smart Home Dashboard! 🏠</h3>
          <p className="text-sm">Let&apos;s take a quick tour to help you get started with controlling your smart home devices.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="greeting"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Personalized Greeting</h3>
          <p className="text-sm">This shows your personalized greeting with the current time. Click on your name to edit your profile!</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="room-navigation"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Room Navigation</h3>
          <p className="text-sm">Switch between different room categories to see devices in specific areas of your home.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="room-card"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Room Control</h3>
          <p className="text-sm">Each room card shows all devices in that room. Use &quot;All On&quot; or &quot;All Off&quot; for quick control, or expand to control individual devices.</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="weather-widget"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Weather & Environment</h3>
          <p className="text-sm">Check current weather conditions and environmental data for your home.</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="energy-monitor"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Energy Monitoring</h3>
          <p className="text-sm">Monitor your home&apos;s energy consumption and track usage patterns to save on bills.</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="security-panel"]',
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">Security System</h3>
          <p className="text-sm">Monitor your security cameras, sensors, and get alerts about any security events.</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">You&apos;re All Set! 🎉</h3>
          <p className="text-sm">You can now control your smart home devices, monitor energy usage, and manage your security system. Enjoy your smart home experience!</p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      disableOverlayClose
      disableScrolling
      styles={{
        options: {
          primaryColor: '#8b5cf6',
          zIndex: 1000,
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          color: '#ffffff',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        },
        tooltipTitle: {
          color: '#ffffff',
        },
        tooltipContent: {
          color: '#e2e8f0',
        },
        buttonNext: {
          backgroundColor: '#8b5cf6',
          color: '#ffffff',
          borderRadius: '8px',
          border: 'none',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        buttonBack: {
          color: '#8b5cf6',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#94a3b8',
        },
        buttonClose: {
          color: '#94a3b8',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'none',
        },
        spotlight: {
          backgroundColor: 'transparent',
          borderRadius: '12px',
          border: '2px solid rgba(139, 92, 246, 0.8)',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  );
}
