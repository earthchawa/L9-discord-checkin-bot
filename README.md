# L9 Discord Check-in Bot 🦆

A lightweight attendance system for the **LORDNINE (L9)** MMORPG guild **MadDuck**. It checks who is in the guild's Discord voice channel and logs attendance to Google Sheets, so guild leaders never have to take roll call by hand.

<img width="1170" height="777" alt="MadDuck Attendance dashboard" src="https://github.com/user-attachments/assets/4b180759-113f-454d-9105-2f69c508c1da" />

## 🏗️ Architecture

```
Google Sheets + Apps Script  ──POST /check-voice──▶  Node.js bot (this repo)  ──▶  Discord API
   (dashboard & database)    ◀──── members in voice ────  (Express + discord.js)
```

- **Bot service (this repo):** an Express server with a discord.js client. `POST /check-voice` returns every member currently in a voice channel.
- **Google Apps Script:** calls the bot on check-in, writes results to the sheet and serves the **MadDuck Attendance** dashboard (summary, leaderboard, weekly view).
- **Google Sheets:** the database for members, check-in timestamps and attendance %.

## ✨ Features

- **One-click check-in:** a single button snapshots everyone in the voice channel.
- **Attendance dashboard:** total sessions, member count, average attendance and a leaderboard.
- **Weekly view:** attendance broken down week by week.
- **Low cost:** the bot runs on a free Node.js host (e.g. Render); everything else is Google Workspace.

## 🔌 API

| Method | Path | Description |
|---|---|---|
| `POST` | `/check-voice` | Body `{ "guildId", "channelId" }` → `{ channelName, count, members: [{ id, username, displayName, tag }] }` |
| `GET` | `/health` | Bot status |

## 🚀 Setup

1. **Discord bot:** create an app in the [Discord Developer Portal](https://discord.com/developers/applications), enable the **Server Members** intent, and invite the bot to your server.
2. **Run the bot:**
   ```bash
   npm install
   DISCORD_BOT_TOKEN=your-token npm start
   ```
   Or deploy to Render / Railway with `DISCORD_BOT_TOKEN` set as an environment variable.
3. **Google Sheet:** in `Extensions › Apps Script`, call `POST <bot-url>/check-voice` with your guild and voice channel IDs, then deploy the script as a web app for the dashboard.

## 💻 Tech Stack

Node.js · Express · discord.js v14 · Google Apps Script · Google Sheets · HTML/CSS

---

*Created by [Earth](https://github.com/earthchawa) · [earthcha.com](https://earthcha.com)*
