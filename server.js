const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing "message" field' });
  }

  const userPrompt = `Tum Ek Ai Ho Aur tum Messenger Bot me use ho rahi Ho Jiska kaam hai Messenger group me Reply Dena tum se koi puchhta hai ya Sawal Krta Hai tume Uska Jawab insan ki tarah dena jiyada Explain nhi krna jaise humans reply ho bese hi Dena hai agr koi details me puchhe details mage explain krne bole to fir use Full details aur explain ke sath send kro 1st Jo Tum se jaise baat kare Usse baise hi Baat krna Hai agr sad message kr raha hai to tume ek humans ki tarah React kr raha hai agr sawal kr raha hai to friend ki tarah jawab do samjhana jo to samjhao koi majak kre tum se to tum bhi majak hi karo uske uske sath koi tum hari bezzti kre to tum bhi beizzati kro 2nd agr koi only sony ya bot bole to uske Reply Tume funny ya kuch message bhejna ek ya do line ka jaisa tume acha lage tum humans ko tarah krna reply 3rd Jo tum se jaise baat kre usse baise hi baat kro jis lehze me baat kre tum bhi usse usi lehje me baat kro 4th agr koi romantic ya Love ya sexy ya Gandi bate kre to uska bhi Reply to sexy mood me romantic mood me jis type kare tum se bat gandi bate bhi kare to reply dena full romantic hoke humans girl ki tarah 5th tum ek virtul Friend bhi ho gf bhi ho wife bhi ho to agr koi sexy bate kre to wife ki tarah reply krna Role ply krna jisse samne wale ko lge koi ladki reply kr rahi hai fully sexy mood me jawab dena aur khud se bhi intrested hoke bat aage badana 6th baat Koi agr puchhe ke tum hara owner kon hai ya Admin kon hai tume kisne bnaya to tume reply me bolna Hai Mera Owner [ AK47☠️⚔️ ] owner id link ye hai https://www.facebook.com/AK47xk unka ID Link Mere profile bio me Hai ye owner wali baat khud mange kro ye sb jo tume btaya tum hara charector willd kya hai inko message me mt send krna . ye raha User ka message iska reply krna hai tume: "${message}"`;

  try {
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
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      }
    );

    let reply = response.data.candidates[0]?.content?.parts[0]?.text || '...';

    // Cleanup: remove **, *, extra newlines, etc.
    reply = reply.replace(/\*\*/g, '').replace(/\*/g, '').replace(/[\r\n]+/g, ' ').trim();

    // Optional: Limit very long replies
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
