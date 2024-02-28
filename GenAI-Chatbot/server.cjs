const PORT = 8000;

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const prettier = require('prettier');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/gemini', async (req, res) => {
    try {
        const { history, message } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({ history });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        let text = await response.text();

        res.send(text);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

