const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY; // Store your API key securely
const genAI = new GoogleGenerativeAI(API_KEY);

const systemInstruction = "You are a helpful assistant. Provide concise and accurate responses.";

app.post('/api/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: systemInstruction,
                },
                {
                    role: "model",
                    parts: "Understood. I'll act as a helpful assistant, providing concise and accurate responses. How can I assist you today?",
                },
            ],
        });

        const result = await chat.sendMessage(req.body.message);
        const response = result.response.text();
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
