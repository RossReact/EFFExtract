const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { extractAllFiles } = require('../utils/fileHandler');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route to upload .eff file and extract its contents
router.post('/upload', upload.single('effFile'), async (req, res) => {
    const filePath = req.file.path;
    console.log(`Received file: ${filePath}`);

    try {
        const { datFiles, lstContent } = await extractAllFiles(filePath);
        console.log('Extraction successful. Sending response to frontend...');
        res.json({
            message: 'Files extracted successfully',
            datFiles,
            lstContent,
        });
    } catch (err) {
        console.error('Error during extraction:', err.message);
        res.status(500).json({
            error: 'Failed to extract files',
            details: err.message,
        });
    }
});

router.get('/file-content', (req, res) => {
    const { fileName } = req.query;
    const filePath = path.join(__dirname, '../extracted', fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
});

module.exports = router;