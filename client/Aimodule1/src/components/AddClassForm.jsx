// import React, { useState } from 'react';
// import axios from 'axios';

// function AddClassForm() {
//   const [className, setClassName] = useState('');

//   const handleClassSubmit = async (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior.

//     // Define the API endpoint where you want to send the data.
//     const apiUrl = '/addClasses'; // Replace with your actual API endpoint.

//     try {
//       // Make a POST request to add the class using Axios.
//       const response = await axios.post(apiUrl, { className });

//       // Handle the response as needed (e.g., show a success message).
//       console.log('Class added successfully', response.data);

//       // Optionally, you can reset the form after a successful submission.
//       setClassName('');
//     } catch (error) {
//       // Handle any errors that occurred during the API request (e.g., show an error message).
//       console.error('Error adding class', error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleClassSubmit}>
//         <input
//           type="text"
//           placeholder="Class Name"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//         />
//         <button type="submit">Add Class</button>
//       </form>
//     </div>
//   );
// }

// export default AddClassForm;





import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AddClassForm() {
  const [classNames, setClassNames] = useState(['']); // Initial array with one empty string for the first class.

  const handleClassSubmit = async (e) => {
    e.preventDefault();

    // Define the API endpoint where you want to send the data.
    const apiUrl = '/addClasses'; // Replace with your actual API endpoint.

    try {
      // Make a POST request to add the classes using Axios.
      const response = await axios.post(apiUrl, { classNames }).then((response) => {
        toast.success('Added Successfully');
        return response.data;

        
      }).catch((error) => {
        // Handle any errors that occurred during the API request (e.g., show an error message).
        // console.log('Already added', error);
        toast.error('Already Present In DB');
      });
if (response.data.data){
  toast.success('Added Successfully');
}
      // Handle the response as needed (e.g., show a success message).
      console.log('Classes added successfully', response.data);

      // Optionally, you can reset the form after a successful submission.
      setClassNames(['']);
    } catch (error) {
      // Handle any errors that occurred during the API request (e.g., show an error message).
      console.error('Error adding classes', error);
    }
  };

  const handleAddClassField = () => {
    setClassNames([...classNames, '']); // Add a new empty class name field.
  };

  const handleClassChange = (index, value) => {
    const updatedClassNames = [...classNames];
    updatedClassNames[index] = value;
    setClassNames(updatedClassNames);
  };

  return (
    <div>
      <form onSubmit={handleClassSubmit}>
        {classNames.map((className, index) => (
          <input
            key={index}
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => handleClassChange(index, e.target.value)}
          />
        ))}
        <button type="button" onClick={handleAddClassField}>
          Add More Class
        </button>
        <button type="submit">Add Classes</button>
      </form>
    </div>
  );
}

export default AddClassForm;
