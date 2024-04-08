// import React from 'react';
// import { BallTriangle } from 'react-loader-spinner';

// const BallTriangleSpinner = () => {
//   const containerStyle = {
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: 'rgba(0, 0, 0, 0.8)', // Semi-transparent white background
//     zIndex: 9999, // Set a high z-index to ensure it appears above other elements
//   };
//   return (
//     <div style={containerStyle}>
//     {/* BallTriangle Spinner */}
//     <BallTriangle
//         height={100}
//         width={100}
//         radius={5}
//         color="red"
//         ariaLabel="ball-triangle-loading"
//         wrapperStyle={{}}
//         wrapperClass=""
//         visible={true}
//       />
//     </div>
//   );
// };

// export default BallTriangleSpinner;



import React from 'react';
import { useSpinnerContext } from '../../SpinnerContext';
import { BallTriangle } from 'react-loader-spinner';

const MyComponent = () => {
  const { spinnerVisible } = useSpinnerContext();

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
    visibility: spinnerVisible ? 'visible' : 'hidden',
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
        visible={spinnerVisible}
      />
    </div>
  );
};

export default MyComponent;

