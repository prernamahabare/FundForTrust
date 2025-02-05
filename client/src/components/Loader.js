import React from 'react';

const Loader = ({ variant = 'spinner', size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-16 w-16',
    medium: 'h-24 w-24',
    large: 'h-32 w-32'
  };

  const renderSpinner = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}></div>
      <div className={`absolute top-0 ${sizeClasses[size]} rounded-full border-4 border-blue-500 border-t-transparent animate-spin`}></div>
    </div>
  );

  const renderPulse = () => (
    <div className="flex space-x-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`bg-blue-500 rounded-full animate-pulse`}
          style={{
            width: size === 'small' ? '1rem' : size === 'medium' ? '1.5rem' : '2rem',
            height: size === 'small' ? '1rem' : size === 'medium' ? '1.5rem' : '2rem',
            animationDelay: `${i * 0.15}s`
          }}
        ></div>
      ))}
    </div>
  );

  const renderRipple = () => (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full bg-blue-500 opacity-75 animate-ping`}></div>
      <div className={`absolute top-0 ${sizeClasses[size]} rounded-full bg-blue-500`}></div>
    </div>
  );

  const loaderVariants = {
    spinner: renderSpinner,
    pulse: renderPulse,
    ripple: renderRipple
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {loaderVariants[variant]()}
      {text && (
        <p className="mt-4 text-lg font-medium text-white animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;