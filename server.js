const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Bot Token
const token = '7294807656:AAF9PwKOAL7MdbHgNQZY7mJNdVRFBRUCicw';
const bot = new TelegramBot(token, { polling: true });

// Basic Bot Logic
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';

    // If tagged or private message
    if (text.includes('@grokypokylockybot') || msg.chat.type === 'private') {
        // Feedback/Questions logic
        console.log(`[Bot Feedback] From ${msg.from.first_name}: ${text}`);

        if (text.toLowerCase().includes('help') || text.toLowerCase().includes('how')) {
            bot.sendMessage(chatId, "I'm TheDude. Use the dashboard to log buy-ins and balances. In the Settlement tab, use 'Beem It' for fast payments and check the box when done. Simple as that. 🤐");
        } else {
            bot.sendMessage(chatId, "Got it. I'll pass that feedback along. 🤐👍");
        }
    }
});

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Server-side trigger for the announcement (for the agent to use)
app.post('/api/announce', (req, res) => {
    // This will be used by the agent to send the one-time message
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Boat Dashboard running on port ${PORT}`);
});
