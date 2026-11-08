import React, { useEffect, useState } from 'react';

/**
 * AnimatedCounter
 * Animates a numerical or currency value smoothly from 0 to the target.
 */
export default function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.2 }) {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numeric part from string if necessary
  const numericTarget = typeof value === 'number' 
    ? value 
    : parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      
      // Ease-out cubic easing
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easedProgress * numericTarget);
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(numericTarget);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [numericTarget, duration]);

  // Format with locale commas (e.g. 12,684 or 8,42,000)
  const formatted = displayValue.toLocaleString('en-IN');

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
