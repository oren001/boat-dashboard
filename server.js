const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Bot Token
const token = '7294807656:AAF9PwKOAL7MdbHgNQZY7mJNdVRFBRUCicw';
const bot = new TelegramBot(token, { polling: true });

let lastChatId = null;

// Basic Bot Logic
bot.on('message', (msg) => {
    lastChatId = msg.chat.id;
    const chatId = msg.chat.id;
    const text = msg.text || '';

    // Log every message for debugging
    console.log(`[Bot Debug] Msg from ${msg.chat.id} (${msg.from.username}): ${text}`);
    lastChatId = msg.chat.id;

    // If tagged or private message
    if (text.includes('@grokypokylockybot') || msg.chat.type === 'private') {

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

// Debug status
app.get('/api/debug', (req, res) => {
    res.json({
        lastChatId,
        bot_username: 'grokypokylockybot',
        status: 'polling'
    });
});

// Server-side trigger for the announcement
app.post('/api/announce', (req, res) => {
    console.log(`[Bot] Manual announce requested. Target ID: ${lastChatId}`);
    if (!lastChatId) return res.status(400).json({ status: 'error', message: 'No chat ID discovered yet. Please tag the bot in the group first.' });

    const message = `*Friday Poker Social (REV 5.1) is LIVE!* 🃏💎\n\nWe've overhauled the settlement process to make it faster and clearer:\n✅ *Live Payment Tracking* – Check off transfers in real-time. Syncs for everyone!\n✅ *Smart Settlements* – Multi-path matching to minimize your bank transfers.\n✅ *Instant Beem* – One-click payments with "Poker" description auto-filled.\n\n*Next Game: Friday @ 8:30 PM*\nJoin the action here: https://boat-dashboard-b9w4.onrender.com/\n\nQuestions? Tag me (@grokypokylockybot) and I'll help you out! 🤐🚀`;

    bot.sendMessage(lastChatId, message, { parse_mode: 'Markdown' })
        .then(() => {
            console.log(`[Bot] Announcement sent to ${lastChatId}`);
            res.json({ status: 'ok', sentTo: lastChatId });
        })
        .catch(err => {
            console.error(`[Bot Error] ${err.message}`);
            res.status(500).json({ status: 'error', details: err.message });
        });
});

app.listen(PORT, () => {
    console.log(`Boat Dashboard running on port ${PORT}`);
});
