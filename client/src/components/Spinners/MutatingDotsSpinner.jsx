import React from 'react';
import { MutatingDots } from 'react-loader-spinner';

const MutatingDotsSpinner = () => {
  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.8)', // Semi-transparent white background
    zIndex: 9999, // Set a high z-index to ensure it appears above other elements
  };

  return (
    <div style={containerStyle}>
      {/* MutatingDots Spinner */}
      <MutatingDots
        visible={true}
        height={100}
        width={100}
        color="#4fa94d"
        secondaryColor="#4fa94d"
        radius={12.5}
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default MutatingDotsSpinner;
