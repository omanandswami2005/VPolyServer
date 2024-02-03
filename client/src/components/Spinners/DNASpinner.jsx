import React from 'react';
import { DNA } from 'react-loader-spinner';

const DNASpinner = () => {
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
      {/* DNA Spinner */}
      <DNA
        visible={true}
        height={80}
        width={80}
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default DNASpinner;
