const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // โหลดค่าในไฟล์ .env

const app = express();
app.use(bodyParser.json());

// ---- CONFIG ----
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
// ----------------

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// endpoint ให้ Google Apps Script เรียก
app.post('/check-voice', async (req, res) => {
  try {
    const { guildId, channelId } = req.body;

    if (!guildId || !channelId) {
      return res.status(400).json({ error: 'guildId and channelId are required' });
    }

    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);

    // type 2 = Voice channel
    if (!channel || channel.type !== 2) {
      return res.status(400).json({ error: 'Not a voice channel' });
    }

    await guild.members.fetch(); // อัปเดต cache

    const membersInChannel = channel.members.map(m => ({
      id: m.id,
      username: m.user.username,
      displayName: m.displayName,
      tag: m.user.tag
    }));

    return res.json({
      channelId,
      channelName: channel.name,
      count: membersInChannel.length,
      members: membersInChannel
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

// start http server
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    botTag: client.user ? client.user.tag : 'Bot Starting...' 
  });
});

// เพิ่มส่วนนี้เข้าไปครับ: ประตูหน้าบ้าน
app.get('/', (req, res) => {
  res.send('<h1>🦆 MadDuck Bot is Online!</h1><p>Status: Ready to work.</p>');
});

app.listen(port, () => {
    console.log(`✅ Server is listening on port ${port}`);
    
    // เริ่มกระบวนการตรวจสอบก่อน Login
    console.log("------------------------------------------------");
    console.log("🔍 DEBUG MODE: Starting Bot Login...");
    
    // 1. เช็ค Token
    const token = DISCORD_BOT_TOKEN;
    if (!token) {
        console.error("❌ ERROR: Token is MISSING (Empty)!");
        console.error("👉 กรุณาไปใส่ DISCORD_BOT_TOKEN ใน Environment Variables");
        return;
    }
    console.log(`ℹ️  Token Found (Length: ${token.length} chars)`);
    // เช็คว่าเผลอมีช่องว่างหัวท้ายไหม
    if (token.trim().length !== token.length) {
        console.error("⚠️ WARNING: Token might have spaces around it!");
    }

    // 2. พยายาม Login พร้อมดักจับ Error
    console.log("⏳ Attempting to login to Discord...");
    client.on('debug', info => console.log(`[DEBUG] ${info}`));
    client.on('warn', info => console.log(`[WARN] ${info}`));
    client.login(token)
        .then(() => {
            console.log("🎉 Login Successful! Waiting for 'ready' event...");
        })
        .catch(err => {
            console.error("------------------------------------------------");
            console.error("❌ LOGIN FAILED (เข้าสู่ระบบไม่สำเร็จ)");
            console.error("💥 Error Name:", err.name);
            console.error("💥 Error Message:", err.message);
            console.error("------------------------------------------------");
            
            if (err.code === 'DisallowedIntents') {
                console.error("💡 คำแนะนำ: คุณลืมเปิด Intents ใน Discord Dev Portal!");
                console.error("👉 ไปที่ https://discord.com/developers/applications > Bot > Privileged Gateway Intents > เปิดให้หมด 3 อัน");
            } else if (err.code === 'TokenInvalid') {
                console.error("💡 คำแนะนำ: Token ผิด หรือถูกยกเลิกไปแล้ว");
                console.error("👉 ลอง Reset Token ใหม่ แล้วเอามาแปะใน Render");
            }
        });
});

// เพิ่มตัวดัก Error ระดับ Global กันเหนียว
client.on('error', error => {
    console.error("🚨 Discord Client Error:", error);
});
