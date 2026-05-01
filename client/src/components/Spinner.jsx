import React from 'react';

const Spinner = ({ fullScreen = false }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-sm text-gray-500 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-8 w-full">
      {spinnerContent}
    </div>
  );
};

export default Spinner;
