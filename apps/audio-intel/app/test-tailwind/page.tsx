'use client';

import { useEffect, useState } from 'react';

export default function TestTailwindPage() {
  const [tailwindWorking, setTailwindWorking] = useState<boolean | null>(null);
  const [customColorsWorking, setCustomColorsWorking] = useState<boolean | null>(null);
  const [animationsWorking, setAnimationsWorking] = useState<boolean | null>(null);
  const [responsiveWorking, setResponsiveWorking] = useState<boolean | null>(null);

  useEffect(() => {
    // Test if Tailwind is working by checking if classes are applied
    const testElement = document.createElement('div');
    testElement.className = 'bg-red-500 text-white p-2';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const isWorking = computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                     computedStyle.backgroundColor !== 'transparent';
    
    setTailwindWorking(isWorking);
    document.body.removeChild(testElement);

    // Test custom colors
    const customColorElement = document.createElement('div');
    customColorElement.className = 'bg-brand-blue';
    document.body.appendChild(customColorElement);
    
    const customColorStyle = window.getComputedStyle(customColorElement);
    const customColorsOk = customColorStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                          customColorStyle.backgroundColor !== 'transparent';
    
    setCustomColorsWorking(customColorsOk);
    document.body.removeChild(customColorElement);

    // Test responsive design
    const checkResponsive = () => {
      const width = window.innerWidth;
      setResponsiveWorking(width > 0);
    };
    
    checkResponsive();
    window.addEventListener('resize', checkResponsive);

    // Test animations
    setTimeout(() => {
      setAnimationsWorking(true);
    }, 1000);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  const getStatusColor = (working: boolean | null) => {
    if (working === null) return 'bg-gray-300 text-gray-600';
    return working ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
  };

  const getStatusText = (working: boolean | null) => {
    if (working === null) return 'Testing...';
    return working ? '✅ Working' : '❌ Not Working';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 gradient-text">
          Tailwind CSS Test Page
        </h1>

        {/* Status Dashboard */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg font-semibold ${getStatusColor(tailwindWorking)}`}>
              Tailwind CSS: {getStatusText(tailwindWorking)}
            </div>
            <div className={`p-4 rounded-lg font-semibold ${getStatusColor(customColorsWorking)}`}>
              Custom Colors: {getStatusText(customColorsWorking)}
            </div>
            <div className={`p-4 rounded-lg font-semibold ${getStatusColor(animationsWorking)}`}>
              Animations: {getStatusText(animationsWorking)}
            </div>
            <div className={`p-4 rounded-lg font-semibold ${getStatusColor(responsiveWorking)}`}>
              Responsive: {getStatusText(responsiveWorking)}
            </div>
          </div>
        </div>
        
        {/* Basic Tailwind Classes */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Basic Tailwind Classes</h2>
          <div className="space-y-4">
            <div className="bg-blue-500 text-white p-4 rounded">Blue Background</div>
            <div className="bg-green-500 text-white p-4 rounded">Green Background</div>
            <div className="bg-red-500 text-white p-4 rounded">Red Background</div>
            <div className="bg-yellow-500 text-black p-4 rounded">Yellow Background</div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Expected:</strong> Four colored boxes with white/black text and rounded corners
          </div>
        </div>

        {/* Custom Brand Colors */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Custom Brand Colors</h2>
          <div className="space-y-4">
            <div className="bg-brand-blue text-white p-4 rounded">Brand Blue (#3B4AC6)</div>
            <div className="bg-brand-yellow text-black p-4 rounded">Brand Yellow (#FFD700)</div>
            <div className="bg-gradient-to-r from-brand-blue to-brand-yellow text-white p-4 rounded">
              Brand Gradient
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Expected:</strong> Deep blue, bright gold, and gradient between them
          </div>
        </div>

        {/* Custom Animations */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Custom Animations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="animate-bounce-in bg-blue-500 text-white p-4 rounded text-center">
              Bounce In
            </div>
            <div className="animate-fade-in bg-blue-500 text-white p-4 rounded text-center">
              Fade In
            </div>
            <div className="animate-gradient-x bg-gradient-to-r from-blue-500 to-blue-500 text-white p-4 rounded text-center">
              Gradient X
            </div>
            <div className="animate-spin-slow bg-orange-500 text-white p-4 rounded text-center">
              Spin Slow
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Expected:</strong> Bounce on load, fade in, moving gradient, continuous spin
          </div>
        </div>

        {/* Custom Components */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Custom Components</h2>
          <div className="space-y-4">
            <button className="btn-primary">Primary Button (Hover me!)</button>
            <div className="postcraft-card">
              <h3 className="text-lg font-semibold mb-2">PostCraft Card (Hover me!)</h3>
              <p className="text-gray-600">This is a custom card component with hover effects.</p>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Expected:</strong> Button with hover effects, card that lifts on hover, progress bar with brand gradient
          </div>
        </div>

        {/* Responsive Design */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Responsive Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-200 p-4 rounded text-center">
              <span className="block md:hidden">📱 Mobile</span>
              <span className="hidden md:block lg:hidden">📱 Tablet</span>
              <span className="hidden lg:block">💻 Desktop</span>
            </div>
            <div className="bg-green-200 p-4 rounded text-center">
              <span className="block md:hidden">📱 Mobile</span>
              <span className="hidden md:block lg:hidden">📱 Tablet</span>
              <span className="hidden lg:block">💻 Desktop</span>
            </div>
            <div className="bg-red-200 p-4 rounded text-center">
              <span className="block md:hidden">📱 Mobile</span>
              <span className="hidden md:block lg:hidden">📱 Tablet</span>
              <span className="hidden lg:block">💻 Desktop</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <strong>Expected:</strong> Resize browser window to see different text (Mobile/Tablet/Desktop)
          </div>
        </div>

        {/* Dark Mode Support */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Dark Mode Support</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This section supports dark mode. Click the button below to test.
          </p>
          <button 
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="mt-4 bg-gray-800 dark:bg-white text-white dark:text-gray-800 px-4 py-2 rounded"
          >
            🌙 Toggle Dark Mode
          </button>
          <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-400 text-blue-700 dark:text-blue-300 rounded">
            <strong>Expected:</strong> Click button to see background and text colors change
          </div>
        </div>

        {/* Final Status */}
        <div className={`p-6 rounded-lg text-center text-lg font-semibold ${
          tailwindWorking && customColorsWorking && animationsWorking && responsiveWorking
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {tailwindWorking && customColorsWorking && animationsWorking && responsiveWorking ? (
            <>
              <strong>🎉 SUCCESS!</strong><br />
              All Tailwind CSS features are working correctly!
            </>
          ) : (
            <>
              <strong>⚠️ ISSUES DETECTED!</strong><br />
              Check the status dashboard above for specific problems.
            </>
          )}
        </div>

        {/* Troubleshooting Guide */}
        {(!tailwindWorking || !customColorsWorking || !animationsWorking || !responsiveWorking) && (
          <div className="mt-8 bg-yellow-100 border border-yellow-400 text-yellow-700 p-6 rounded">
            <h3 className="text-lg font-semibold mb-4">🔧 Troubleshooting Guide</h3>
            <ul className="list-disc list-inside space-y-2">
              {!tailwindWorking && (
                <li>Tailwind not working: Check if <code>globals.css</code> is imported in <code>layout.tsx</code></li>
              )}
              {!customColorsWorking && (
                <li>Custom colors not working: Check <code>tailwind.config.ts</code> brand colors configuration</li>
              )}
              {!animationsWorking && (
                <li>Animations not working: Check <code>tailwind.config.ts</code> keyframes and animations</li>
              )}
              {!responsiveWorking && (
                <li>Responsive not working: Check viewport meta tag and responsive classes</li>
              )}
              <li>Check browser console for any error messages</li>
              <li>Verify development server is running on port 3000</li>
              <li>Try hard refresh (Ctrl+F5 or Cmd+Shift+R)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 