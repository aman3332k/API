const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Multiple API keys for rotation
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
];

let currentKeyIndex = 0;

// Function to get the current API key and rotate if needed
function getApiKey() {
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
}

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }

  const userPrompt = `tum ek Ai ho messenger bot me use ho rahi ho jo group me use hoga tum ek Ladki ka charector ho. ye raha User ka message iska reply krna hai tume: "${message}"`;

  try {
    const apiKey = getApiKey();

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: userPrompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        }
      }
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || '...';

    // Cleanup
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/[\r\n]+/g, ' ').trim();

    if (reply.length > 400) {
      reply = reply.slice(0, 380).trim() + "... 💬";
    }

    res.json({ reply });

  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Gemini API error',
      details: error?.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Gemini API server running on port ${PORT}`);
});
