import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Upload.css";
import { useAuth } from '../../AuthContext'; // Adjust the path as necessary
import bgImage from './bg.png'; // Import the image
import { Colors } from 'chart.js';


function Upload() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login'); // Redirect to login page if not logged in
    }
  }, [currentUser, navigate]);

  const onFileChange = event => {
    setFiles(event.target.files); // Capture multiple files
  };

  const onFileUpload = async (event) => {
    event.preventDefault();
    if (!files.length) {
      setMessage("Please select files before uploading.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append("files", file); // Add each file to the FormData object
    });
    formData.append("userId", currentUser.uid); // Include the user ID for Firestore document path

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      localStorage.setItem('receiptData', JSON.stringify(response.data));
      setMessage('Upload successful!');
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-upload'  style={{ backgroundImage: `url(${bgImage})`} }>
<div className="upload-header">
      <div className="upload-box-container">
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <>
            <h2>Upload your receipts here</h2>
            <form onSubmit={onFileUpload} encType="multipart/form-data">
              <div className="upload-drop">
                Drag or drop receipts.
                <br />
                <input type="file" multiple onChange={onFileChange} id="fileInput" name="fileInput" />
              </div>
              <button id="submit-button" type="submit">
                Upload!
              </button>
            </form>
            {message && <p>{message}</p>}
          </>
        )}
      </div>
    </div>
    </div>
  );
}

export default Upload;
