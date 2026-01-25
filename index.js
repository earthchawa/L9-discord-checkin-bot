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

app.listen(port, () => {
    console.log(`Bot is listening on port ${port}`);
});
client.login(DISCORD_BOT_TOKEN);
