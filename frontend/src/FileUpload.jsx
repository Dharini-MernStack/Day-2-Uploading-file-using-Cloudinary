import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Reset states
      setError("");
      setUploadProgress(0);
      setUploadedImage(null);

      // Validate file type
      if (!selectedFile.type.match(/image\/(jpeg|png|gif)/)) {
        setError("Please select a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        setUploadedImage(response.data.data);
        setPreviewUrl("");
        setFile(null);
        setUploadProgress(0);
      } else {
        setError(response.data.message || "Upload failed");
      }
    } catch (error) {
      let errorMessage = "Upload failed. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "Network error. Please check your connection.";
      }
      
      setError(errorMessage);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    setUploadProgress(0);
    handleUpload();
  };

  return (
    <div className="file-upload-container">
      <h2>Image Upload</h2>
      
      <div className="upload-area">
        <input
          type="file"
          id="file-input"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          className="file-input"
          disabled={loading}
        />
        <label htmlFor="file-input" className={`file-label ${loading ? 'disabled' : ''}`}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="preview-image" />
          ) : (
            <div className="upload-placeholder">
              <span>Click to select an image</span>
              <span className="upload-hint">(JPEG, PNG, or GIF, max 5MB)</span>
            </div>
          )}
        </label>
      </div>

      {loading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span className="progress-text">{uploadProgress}%</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            className="retry-button"
            disabled={loading}
          >
            Try Again
          </button>
        </div>
      )}

      {previewUrl && !loading && !error && (
        <button 
          onClick={handleUpload} 
          className="upload-button"
        >
          Upload Image
        </button>
      )}

      {uploadedImage && (
        <div className="upload-success">
          <h3>Upload Successful!</h3>
          <img 
            src={uploadedImage.url} 
            alt="Uploaded" 
            className="uploaded-image"
          />
          <div className="image-details">
            <p>Size: {(uploadedImage.size / 1024).toFixed(2)} KB</p>
            <p>Dimensions: {uploadedImage.width} x {uploadedImage.height}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
