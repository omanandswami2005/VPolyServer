import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

function WelcomeToast(props) {
 

  useEffect(() => {

    const style = {
      backgroundColor: 'yellow',
      padding: '10px',
      textAlign: 'center',
      position: 'fixed',
      bottom: '6000%',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '9999', /* Set a high z-index to ensure it's on top of other content */
      width: '300px', /* Adjust the width as needed */
      boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' /* Optional: Add a box shadow */
    };

    // Display a welcome toast when the component mounts
    const welcomeToast = toast.custom((t) => (
      <div style={style}>
        <strong>Welcome {props.name} sir!</strong>
        <br />
        Enjoy your experience.
      </div>
    ));

    // Automatically dismiss the welcome toast after a few seconds (e.g., 5 seconds)
    setTimeout(() => {
      toast.dismiss(welcomeToast.id);
    }, 5000);
  }, [props.name]);

  // You need to return something here, e.g., null
  return null;
}

export default WelcomeToast;
