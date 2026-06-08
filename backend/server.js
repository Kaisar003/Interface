require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for frontend requests
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Endpoint to handle form submission
app.post('/api/send-message', async (req, res) => {
    try {
        const { name, phone, service, message } = req.body;

        // Build WhatsApp message
        let text = `Новая заявка с сайта:\n\n`;
        text += `👤 Имя: ${name}\n`;
        text += `📞 Телефон: ${phone}\n`;
        if (service) text += `🔧 Услуга: ${service}\n`;
        if (message) text += `💬 Сообщение: ${message}\n`;

        const apiUrl = process.env.GREEN_API_URL;
        const idInstance = process.env.GREEN_API_ID_INSTANCE;
        const apiTokenInstance = process.env.GREEN_API_TOKEN_INSTANCE;
        const targetNumber = process.env.WHATSAPP_NUMBER;

        const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

        // Send to Green API
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chatId: `${targetNumber}@c.us`,
                message: text
            })
        });

        if (!response.ok) {
            throw new Error(`Green API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Respond to frontend
        res.status(200).json({ success: true, message: 'Message sent successfully', data });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
