# Task-App

# 🗂️ Task Management App
 
Welcome to the **Task Management App**! This application helps you organize, track, and manage your tasks efficiently with an intuitive interface.
 
## 🌐 Live Demo
 
[**Access the App**](https://task-app-a1830.web.app)
 
## 🛠️ Tech Stack
 
- **React** (with TypeScript) - Frontend
- **Redux Toolkit** - State Management
- **Firebase** - Authentication & Hosting
- **MUI** - Material UI for responsive design
- **Drag and Drop** - Task reordering
 
## 🧩 Features
 
- 🔍 **Task Filtering** by category
- ✅ **Task Status Management**: Pending, In Progress, Completed
- 🖼️ **Responsive UI** for desktop, tablet, and mobile
- ✏️ **Edit/Delete Tasks**
- 🔒 **User Authentication** via Firebase
- 📊 **Drag-and-Drop** task reordering
 
## 📂 Project Setup
 
1. **Clone the Repository**
 
```bash
git clone https://github.com/Deepaktr20/Task-App.git
cd task-management-app
```
 
2. **Install Dependencies**
 
```bash
npm install
```
 
3. **Setup Environment Variables**
 
Create a `.env` file in the root directory:
 
```plaintext
REACT_APP_FIREBASE_APIKEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```
 
4. **Start the Application**
 
```bash
npm start
```
 
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
 
## 🚀 Build & Deploy
 
### Build for Production
 
```bash
npm run build
```
 
### Firebase Deployment
 
1. **Install Firebase CLI**
 
```bash
npm install -g firebase-tools
```
 
2. **Login to Firebase**
 
```bash
firebase login
```
 
3. **Initialize Firebase Hosting** _(only once)_
 
```bash
firebase init hosting
```
 
4. **Deploy the Application**
 
```bash
firebase deploy
```
 
## 🧪 Testing
 
> _Testing is not yet set up._
 
## 📖 Additional Resources
 
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [MUI Documentation](https://mui.com/)
 
---
 
💡 **Happy Task Managing!** 🚀
