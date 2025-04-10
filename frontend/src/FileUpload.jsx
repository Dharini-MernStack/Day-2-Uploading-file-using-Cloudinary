import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        setFile(null);
        return;
      }
      if (!selectedFile.type.startsWith("image/")) {
        setError("Only image files are allowed");
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );
      setImageUrl(res.data.url);
      setUploadHistory((prev) => [res.data, ...prev]);
    } catch (error) {
      setError(
        error.response?.data?.error || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setUploadHistory(res.data);
    } catch (error) {
      setError("Failed to fetch upload history");
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          disabled={loading}
        />
        <button onClick={handleUpload} disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <button onClick={fetchUploadHistory}>Refresh History</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {imageUrl && (
        <div className="preview-section">
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded file" />
        </div>
      )}

      {uploadHistory.length > 0 && (
        <div className="history-section">
          <h3>Upload History:</h3>
          <div className="image-grid">
            {uploadHistory.map((upload, index) => (
              <div key={index} className="image-item">
                <img src={upload.url} alt={`Upload ${index + 1}`} />
                <p>Uploaded: {new Date(upload.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
