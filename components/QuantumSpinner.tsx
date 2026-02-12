
import React from 'react';

interface QuantumSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'magenta' | 'white';
  className?: string;
}

const QuantumSpinner: React.FC<QuantumSpinnerProps> = ({ 
  size = 'md', 
  color = 'cyan', 
  className = '' 
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16'
  };

  const colorMap = {
    cyan: 'border-cyan-500 shadow-[0_0_15px_rgba(0,243,255,0.5)]',
    magenta: 'border-magenta-500 shadow-[0_0_15px_rgba(255,0,255,0.5)]',
    white: 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Rotating Ring */}
      <div className={`${sizeMap[size]} border-2 border-t-transparent rounded-full animate-[quantum-spin_1s_linear_infinite] ${colorMap[color]}`} />
      
      {/* Inner Pulsating Core */}
      <div className={`absolute inset-0 m-auto w-1/2 h-1/2 rounded-full animate-[quantum-pulse_1.5s_ease-in-out_infinite] ${
        color === 'cyan' ? 'bg-cyan-500' : color === 'magenta' ? 'bg-magenta-500' : 'bg-white'
      }`} />
    </div>
  );
};

export default QuantumSpinner;
