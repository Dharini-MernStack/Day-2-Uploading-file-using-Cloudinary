import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // 👈 This key must match 'file' in upload.single("file")

    try {
      setLoading(true);
      setError("");
      setImageUrl("");

      const res = await axios.post("http://localhost:5000/api/files/upload", formData);

      setImageUrl(res.data.url);
    } catch (error) {
      console.error("Upload failed:", error.response || error.message);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
      />
      <br />
      <button onClick={handleUpload} disabled={loading} style={{ marginTop: "10px" }}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
