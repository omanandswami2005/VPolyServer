import React from 'react';
import { DNA } from 'react-loader-spinner';

const DNASpinner = () => {
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',  // 100% of the viewport height
    background: '#ffffff',  // White background color
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
