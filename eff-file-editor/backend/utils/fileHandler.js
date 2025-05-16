const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const archiver = require('archiver');

/**
 * Extracts the .eff file and retrieves the .dat file contents.
 * @param {string} effFilePath - Path to the uploaded .eff file.
 * @returns {Promise<string>} - Contents of the .dat file.
 */
function extractEffFile(effFilePath) {
    return new Promise((resolve, reject) => {
        try {
            const zip = new AdmZip(effFilePath);
            const zipEntries = zip.getEntries();

            let datFileContent = null;

            zipEntries.forEach(entry => {
                if (entry.entryName.endsWith('.dat')) {
                    datFileContent = zip.readAsText(entry);
                }
            });

            if (!datFileContent) {
                return reject(new Error('.dat file not found in the .eff archive.'));
            }

            resolve(datFileContent);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Extracts all files from the .eff archive and unzips the .dat file.
 * @param {string} effFilePath - Path to the uploaded .eff file.
 * @returns {Promise<{ datFiles: Array<string>, lstContent: string }>} - List of files in the .dat archive and the content of the .lst file.
 */
function extractAllFiles(effFilePath) {
    return new Promise((resolve, reject) => {
        console.log(`Starting extraction of file: ${effFilePath}`);

        try {
            // Ensure the file exists
            if (!fs.existsSync(effFilePath)) {
                console.error(`File not found: ${effFilePath}`);
                return reject(new Error(`File not found: ${effFilePath}`));
            }

            // Define the extraction directory
            const extractionDir = path.join(__dirname, '../extracted');
            if (!fs.existsSync(extractionDir)) {
                fs.mkdirSync(extractionDir, { recursive: true });
            }

            // Extract the .eff archive
            const zip = new AdmZip(effFilePath);
            zip.extractAllTo(extractionDir, true);
            console.log(`Files extracted to: ${extractionDir}`);

            // Dynamically locate the .dat file
            const extractedFiles = fs.readdirSync(extractionDir);
            console.log(`Extracted files: ${extractedFiles}`);

            const datFileName = extractedFiles.find(file => file.toLowerCase().endsWith('.dat'));
            const lstFileName = extractedFiles.find(file => file.toLowerCase().endsWith('.lst'));

            if (!datFileName) {
                console.error('.dat file not found in the extracted files.');
                return reject(new Error('.dat file not found in the extracted files.'));
            }

            if (!lstFileName) {
                console.error('.lst file not found in the extracted files.');
                return reject(new Error('.lst file not found in the extracted files.'));
            }

            const datFilePath = path.join(extractionDir, datFileName);
            const lstFilePath = path.join(extractionDir, lstFileName);

            // Read the .lst file content
            const lstContent = fs.readFileSync(lstFilePath, 'utf-8');
            console.log(`Content of .lst file: ${lstContent}`);

            // Unzip the .dat file
            console.log(`Attempting to unzip .dat file: ${datFilePath}`);
            const datZip = new AdmZip(datFilePath);
            const datEntries = datZip.getEntries();

            // Get the list of files inside the .dat archive
            const datFiles = datEntries.map(entry => entry.entryName);
            console.log(`Files inside .dat archive:`, datFiles);

            resolve({ datFiles, lstContent });
        } catch (err) {
            console.error(`Error during extraction: ${err.message}`);
            reject(new Error(`Failed to extract files: ${err.message}`));
        }
    });
}

/**
 * Repacks the .dat content into a new .eff file.
 * @param {string} datContent - The content of the .dat file to be repackaged.
 * @returns {Promise<string>} - Path to the newly created .eff file.
 */
function repackageEffFile(datContent) {
    return new Promise((resolve, reject) => {
        const outputEffPath = path.join(__dirname, '../uploads/output.eff');
        const output = fs.createWriteStream(outputEffPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(outputEffPath));
        archive.on('error', err => reject(err));

        archive.pipe(output);
        archive.append(datContent, { name: 'file.dat' });
        archive.finalize();
    });
}

module.exports = { extractEffFile, repackageEffFile, extractAllFiles };