import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setImageUrl("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(res.data.url);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {imageUrl && (
        <div style={{ marginTop: "1rem" }}>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" width="300" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
