# Eff File Editor

## Overview
The Eff File Editor is a web application that allows users to upload, edit, and repackage files with the `.eff` extension. This application consists of a frontend interface for user interactions and a backend server for processing file uploads and handling file operations.

## Project Structure
```
eff-file-editor
├── backend
│   ├── server.js          # Entry point for the backend application
│   ├── routes
│   │   └── fileRoutes.js  # Routes for file handling
│   └── utils
│       └── fileHandler.js  # Utility functions for file operations
├── frontend
│   ├── public
│   │   ├── index.html     # Main HTML document for the frontend
│   │   ├── styles.css     # Styles for the frontend application
│   │   └── script.js      # JavaScript code for frontend interactions
│   └── package.json       # Configuration for the frontend application
├── package.json           # Configuration for the entire project
└── README.md              # Documentation for the project
```

## Features
- Upload `.eff` files.
- Extract and display contents of `.dat` files within the `.eff` files.
- Edit the contents of the extracted files.
- Repackage the edited files back into `.dat` and `.eff` formats.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd eff-file-editor
   ```

2. Install dependencies for the backend:
   ```
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```

4. Start the backend server:
   ```
   cd backend
   node server.js
   ```

5. Start the frontend application:
   ```
   cd frontend
   npm start
   ```

## Usage
- Navigate to the frontend application in your web browser.
- Use the file upload form to upload a `.eff` file.
- Edit the contents of the extracted `.dat` file as needed.
- Submit the changes to repackage the files.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.