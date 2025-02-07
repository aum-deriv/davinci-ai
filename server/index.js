import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { createReadStream, unlink } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600 // Cache preflight request results for 10 minutes
}));

// Parse JSON bodies
app.use(express.json());

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Upload endpoint
app.post('/api/v1/files/upload/:flowId', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const { flowId } = req.params;
        const host = 'https://api.langflow.astra.datastax.com';

        // Create a new FormData instance
        const formData = new FormData();

        // Read the uploaded file and append it to FormData
        const fileStream = createReadStream(req.file.path);
        formData.append('file', fileStream, req.file.originalname);


        // Make request to Langflow API
        const response = await fetch(
            `http://127.0.0.1:7860/api/v1/files/upload/${flowId}`,
            {
                method: "POST",
                body: formData,
                credentials: "include",
                mode: "cors",
                headers: {
                    Authorization:
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNTMzMTUwYS1mM2FmLTQ1MDAtOTFmZS04NGEyYzAyMzI2MzIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY5NjA3NjcwfQ.vZuhYMpjPM7CoXdm3-rmi3YSgNYprMpzF0j2Jl7dSS0",
                    Accept: "application/json",
                },
            }
        );

        // console.log("response", response)

        if (!response.ok) {
            throw new Error(`Error uploading file: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data)

        // Clean up: Delete the uploaded file
        unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: `Error uploading file: ${error.message}` });
    }
});

// Run flow endpoint
app.post('/api/v1/run/:flowId', async (req, res) => {

    console.log(req.body)

    try {

        const { flowId } = req.params;

        const response = await fetch(
            `http://127.0.0.1:7860/api/v1/run/${flowId}?stream=false`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNTMzMTUwYS1mM2FmLTQ1MDAtOTFmZS04NGEyYzAyMzI2MzIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY5NjA3NjcwfQ.vZuhYMpjPM7CoXdm3-rmi3YSgNYprMpzF0j2Jl7dSS0',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(req.body)
            }
        );

        if (!response.ok) {
            throw new Error(`Error running flow: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: `Error running flow: ${error.message}` });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
