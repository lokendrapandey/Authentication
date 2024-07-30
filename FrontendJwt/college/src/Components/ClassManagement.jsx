import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassManagement = ({ token }) => {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sub, setSub] = useState('');
  const [error, setError] = useState('');

  // Function to fetch classes
  const fetchClasses = async () => {
    try {
      // console.log('Fetching classes with token:', token);
      const response = await axios.get('http://localhost:4000/gett', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched classes:', response.data);
      setClasses(response.data);
    } catch (err) {
      setError('Error fetching classes: ' + (err.response?.data || err.message));
      console.error('Error fetching classes:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClasses();
    }
  }, [token]);

  const handleCreate = async () => {
    if (!name || !age || !sub) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:4000/postt', { name, age, sub }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName('');
      setAge('');
      setSub('');
      setError('');
      alert('Class created successfully');
      fetchClasses();
    } catch (err) {
      setError('Error creating class: ' + (err.response?.data || err.message));
      console.error('Error creating class:', err);
    }
  };

  return (
    <div>
      <h2>Class Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subject"
        value={sub}
        onChange={(e) => setSub(e.target.value)}
      />
      <button onClick={handleCreate}>Create Class</button>
      <h3>All Classes</h3>
      <ul>
        {classes.map((classItem) => (
          <li key={classItem._id}>
            {classItem.name} - {classItem.age} - {classItem.sub}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassManagement;














// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ClassManagement = ({ token }) => {
//   const [classes, setClasses] = useState([]);
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [sub, setSub] = useState('');
//   const [error, setError] = useState('');
  
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/gett', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setClasses(response.data);
//       } catch (error) {
//         setError('Error fetching classes');
//         console.error('Error fetching classes:', error);
//       }
//     };

//     console.log(token)
//     fetchClasses();
//   }, [token]);
//   const handleCreate = async () => {
//     if (!name || !age || !sub) {
//       setError('All fields are required');
//       return;
//     }

//     try {
//       await axios.post('http://localhost:4000/postt', { name, age, sub }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setName('');
//       setAge('');
//       setSub('');
//       setError('');
//       alert('Class created successfully');
//       // Refetch classes to update the list
//       const response = await axios.get('http://localhost:4000/gett', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setClasses(response.data);
//     } catch (error) {
//       setError('Error creating class');
//       console.error('Error creating class:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Class Management</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <input
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Age"
//         value={age}
//         onChange={(e) => setAge(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Subject"
//         value={sub}
//         onChange={(e) => setSub(e.target.value)}
//       />
//       <button onClick={handleCreate}>Create Class</button>
//       <h3>All Classes</h3>
//       <ul>
//         {classes.map((classItem) => (
//           <li key={classItem._id}>{classItem.name} - {classItem.age} - {classItem.sub}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ClassManagement;











// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ClassManagement = ({ token }) => {
//   const [classes, setClasses] = useState([]);
//   const [name, setName] = useState('');
//   const [age, setAge] = useState('');
//   const [sub, setSub] = useState('');

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/gett', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setClasses(response.data);
//       } catch (error) {
//         console.error('Error fetching classes:', error);
//       }
//     };

//     fetchClasses();
//   }, [token]);

//   const handleCreate = async () => {
//     try {
//       await axios.post('http://localhost:4000/postt', { name, age, sub }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Class created successfully');
//     } catch (error) {
//       console.error('Error creating class:', error);
//       alert('Error creating class');
//     }
//   };

//   return (
//     <div>
//       <h2>Class Management</h2>
//       <input
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Age"
//         value={age}
//         onChange={(e) => setAge(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Subject"
//         value={sub}
//         onChange={(e) => setSub(e.target.value)}
//       />
//       <button onClick={handleCreate}>Create Class</button>
//       <h3>All Classes</h3>
//       <ul>
//         {classes.map((classItem) => (
//           <li key={classItem._id}>{classItem.name} - {classItem.age} - {classItem.sub}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ClassManagement;
