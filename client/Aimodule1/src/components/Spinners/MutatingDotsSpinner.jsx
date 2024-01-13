import React from 'react';
import { MutatingDots } from 'react-loader-spinner';

const MutatingDotsSpinner = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',  // 100% of the viewport height
    background: '#ffffff',  // White background color
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
