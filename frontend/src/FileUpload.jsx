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
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setImageUrl("");

      const res = await axios.post("http://localhost:5100/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(res.data.url);
    } catch (error) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload a File</h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />

        <button onClick={handleUpload} style={styles.button} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && <p style={styles.error}>{error}</p>}

        {imageUrl && (
          <div style={styles.imagePreview}>
            <img src={imageUrl} alt="Uploaded" style={styles.image} />
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles for responsiveness
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    marginTop: "1rem",
    color: "red",
    textAlign: "center",
  },
  imagePreview: {
    marginTop: "1rem",
    textAlign: "center",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "8px",
  },
};

export default FileUpload;
