const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/api/emotion', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));

    try {
        const response = await axios.post('http://localhost:5001/analyze', formData, {
            headers: formData.getHeaders(),
            timeout: 30000 // (optional) handle long ML inference gracefully
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    } finally {
        fs.unlink(req.file.path, () => { }); // cleanup uploaded file
    }
});

app.listen(4000, () => console.log('Node.js backend running on port 4000'));
