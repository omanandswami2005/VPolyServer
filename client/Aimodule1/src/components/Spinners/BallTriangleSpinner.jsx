import React from 'react';
import { BallTriangle } from 'react-loader-spinner';

const BallTriangleSpinner = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',  // 100% of the viewport height
    background: '#ffffff',  // White background color
  };

  return (
    <div style={containerStyle}>
    {/* BallTriangle Spinner */}
    <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="red"
        ariaLabel="ball-triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default BallTriangleSpinner;
