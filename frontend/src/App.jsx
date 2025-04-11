import FileUpload from './FileUpload'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Image Uploader</h1>
        <p>Upload your images to Cloudinary</p>
      </header>
      <main>
        <FileUpload />
      </main>
    </div>
  )
}

export default App
