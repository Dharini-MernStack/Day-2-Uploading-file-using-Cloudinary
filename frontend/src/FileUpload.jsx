import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setResult(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Image Upload System</h2>
      
      <div style={{ 
        border: '2px dashed #ddd', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          disabled={uploading}
          id="fileInput"
          style={{ display: 'none' }}
        />
        
        <label htmlFor="fileInput" style={{
          display: 'block',
          padding: '12px',
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          borderRadius: '4px',
          cursor: 'pointer',
          textAlign: 'center',
          marginBottom: '15px',
          border: '1px solid #bbdefb'
        }}>
          {file ? file.name : 'Choose an image...'}
        </label>
        
        {preview && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
          </div>
        )}
        
        <button 
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: uploading ? '#bdbdbd' : '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.3s'
          }}
        >
          {uploading ? '⏳ Uploading...' : '☁️ Upload Image'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '20px',
          borderLeft: '4px solid #ef5350'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          borderLeft: '4px solid #43a047'
        }}>
          <h3 style={{ marginTop: 0, color: '#2e7d32' }}>✓ {result.message}</h3>
          
          <div style={{ margin: '15px 0' }}>
            <img 
              src={result.url} 
              alt="Uploaded content" 
              style={{ 
                maxWidth: '100%',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Cloudinary Public ID:</strong> 
            <div style={{ 
              padding: '8px',
              backgroundColor: '#f1f8e9',
              borderRadius: '4px',
              marginTop: '5px',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {result.publicId}
            </div>
          </div>
          
          <div>
            <strong>Stored in MongoDB:</strong>
            <div style={{ 
              padding: '8px',
              backgroundColor: '#f1f8e9',
              borderRadius: '4px',
              marginTop: '5px',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              {result.url}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;