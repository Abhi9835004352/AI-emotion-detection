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
    console.log('Received request for emotion analysis');
    if (!req.file) {
        console.log('No file in request');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', req.file.originalname, req.file.size, 'bytes');
    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));

    try {
        const mlApiUrl = process.env.ML_API_URL || 'http://ml:5001';
        console.log('Calling ML service at:', `${mlApiUrl}/analyze`);
        const response = await axios.post(`${mlApiUrl}/analyze`, formData, {
            headers: formData.getHeaders(),
            timeout: 30000 // (optional) handle long ML inference gracefully
        });
        console.log('ML service response received');
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: true, message: error.message });
    } finally {
        fs.unlink(req.file.path, () => { }); // cleanup uploaded file
    }
});

app.listen(4000, () => console.log('Node.js backend running on port 4000'));
