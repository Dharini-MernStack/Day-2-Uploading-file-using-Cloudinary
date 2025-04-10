## **🛠 Issues to Fix**  

### **1️⃣ Backend: Missing Cloudinary Setup & Integration**  
**Issue**: Cloudinary is not configured correctly. Currently, there's no connection to Cloudinary.  
 **Fix**:  
- Install `cloudinary` and `multer` to handle file uploads.  
- Set up a `.env` file and configure **Cloudinary API credentials** properly.  

**Where to Fix?**  
- Install dependencies: `npm install cloudinary multer dotenv express-fileupload`  
- Update `backend/server.js` to configure Cloudinary.  

---

### **2️⃣ Backend: No Endpoint to Handle File Upload**  
**Issue**: There is no API route for file uploads.  
**Fix**:  
- Create a **new route** (`/upload`) to handle file uploads.  
- Use `multer` middleware to process images before sending them to Cloudinary.  
- Return the Cloudinary URL of the uploaded image.  

**Where to Fix?**  
- Create a new route in `backend/routes/fileRoutes.js`.  
- Import and use this route in `backend/server.js`.  

---

### **3️⃣ Frontend: No File Upload Component**  
 **Issue**: There is no UI to allow users to upload files.  
**Fix**:  
- Create an **upload form** with a file input.  
- Use **Axios** to send the image to the backend.  
- Display the uploaded image URL once Cloudinary processes it.  

**Where to Fix?**  
- Create a new component `FileUpload.jsx`.  
- Update `frontend/src/App.jsx` to use `FileUpload.jsx`.  



### **4️⃣ Frontend: No Error Handling for Upload Failures**  
**Issue**: If the upload fails, no error message is shown.  
**Fix**:  
- Handle errors if Cloudinary upload fails.  
- Show **loading indicators** and **error messages**.  

**Where to Fix?**  
- Update `FileUpload.jsx` to handle errors and loading states.  

---

### **5️⃣ Missing Environment Variables**  
**Issue**: The **Cloudinary credentials** are hardcoded instead of being stored in a `.env` file.  
 **Fix**:  
- Move **Cloudinary API keys** to `.env`.  
- Load them using `dotenv`.  

**Where to Fix?**  
- Create a `.env` file in the `backend/` folder.  
- Update `backend/server.js` to use these variables.  

### **Missing Database Connection
### Issue: The MongoDB connection is not set up, even though MONGO_URI is defined in .env.
### Fix:
- Install mongoose using npm install mongoose.
- Connect to MongoDB in backend/index.js.
- Create a model (Upload.js) to store file URLs in the database.


### **📌 Next Steps**  
1. **Fix these issues** in the project.  
2. **Run the backend server** using `node server.js`.  
3. **Test the file upload feature** by selecting an image.  
4. **Check Cloudinary** to verify that the image is uploaded successfully.  

