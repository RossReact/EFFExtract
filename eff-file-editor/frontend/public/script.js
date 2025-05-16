document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed.');

    let fileContents = {}; // Store the content of each file for editing

    const uploadForm = document.getElementById('uploadForm');
    if (!uploadForm) {
        console.error('uploadForm element not found in the DOM.');
        return;
    }

    uploadForm.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the form from refreshing the page
        console.log('Form submission intercepted.');
        
        const fileInput = document.getElementById('effFile');
        if (!fileInput) {
            console.error('effFile input element not found in the DOM.');
            return;
        }

        const formData = new FormData();
        formData.append('effFile', fileInput.files[0]);

        try {
            console.log('Uploading file...');
            fetch('http://localhost:5000/api/files/upload', {
                method: 'POST',
                body: formData,
            }).then(response => {
                if (!response.ok) {
                    console.error('Error from backend:', result.error);
                    alert(`Error: ${result.error}`);
                    return;
                }

                return response.json();
            }).then(result => {
                console.log('File uploaded successfully. Displaying extracted files...');
                displayExtractedFiles(result.datFiles, result.lstContent);
                });
        } catch (err) {
            console.error('Error during fetch:', err.message);
            alert(`Error: ${err.message}`);
        }
        return false; // Prevent default form submission
    });

    function displayExtractedFiles(datFiles, lstContent) {
        console.log('Displaying extracted files...');
        const fileList = document.getElementById('fileList');
        if (!fileList) {
            console.error('fileList element not found in the DOM.');
            return;
        }

        

        // Display the list of files inside the .dat archive
        const datFileList = document.createElement('div');
        datFileList.innerHTML = `<h3>Files in .dat Archive:</h3>`;
        const ul = document.createElement('ul');
        datFiles.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file;
            li.style.cursor = 'pointer';
            li.style.color = 'blue';
            li.style.textDecoration = 'underline';
            li.addEventListener('click', () => loadFileContent(file)); // Add click event to load file content
            ul.appendChild(li);
        });
        datFileList.appendChild(ul);
        fileList.appendChild(datFileList);

        // Store the initial content of each file (for now, just empty placeholders)
        datFiles.forEach(file => {
            fileContents[file] = ''; // Initialize with empty content
        });

        // Add a text editor for editing files
        const editorContainer = document.getElementById('editorContainer');
        if (!editorContainer) {
            console.error('editorContainer element not found in the DOM.');
            return;
        }
        editorContainer.style.display = 'block'; // Ensure the editor is visible
    }

    function loadFileContent(fileName) {
        console.log(`Loading content for file: ${fileName}`);
        const editor = document.getElementById('fileEditor');
        const saveButton = document.getElementById('saveFileButton');

        // Check if the editor and save button exist
        if (!editor || !saveButton) {
            console.error('Editor or Save Button not found in the DOM.');
            return;
        }

        // Disable the editor and show a loading message
        editor.value = `Loading content for ${fileName}...`;
        editor.disabled = true;
        saveButton.disabled = true;

        // Fetch the file content from the backend
        fetch(`http://localhost:5000/api/files/file-content?fileName=${encodeURIComponent(fileName)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch file content');
                }
                return response.json();
            })
            .then(data => {
                // Update the fileContents object and display the content in the editor
                fileContents[fileName] = data.content;
                editor.value = data.content;
                editor.disabled = false;
                saveButton.disabled = false;
            })
            .catch(err => {
                console.error(`Error fetching content for file ${fileName}:`, err.message);
                editor.value = `Error loading content for ${fileName}`;
            });

        // Save changes when the save button is clicked
        saveButton.onclick = () => {
            fileContents[fileName] = editor.value; // Update the file content
            alert(`Changes to ${fileName} saved!`);
        };
    }
});