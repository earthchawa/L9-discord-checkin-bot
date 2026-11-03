# L9 Discord Check-in Bot 🦆

A lightweight, automated Discord check-in bot and web dashboard built for the **LORDNINE (L9)** MMORPG. Designed to help guild leaders track member attendance and activity without manual data entry.

<img width="1170" height="777" alt="discord-checkin-bot" src="https://github.com/user-attachments/assets/4b180759-113f-454d-9105-2f69c508c1da" />

## 🏗️ Architecture
This project uses a serverless architecture, bridging Discord and Google Workspace:
*   **Frontend/Interface:** Discord commands (for users) and a Web Dashboard (for admins).
*   **Backend/API:** Google Apps Script (handles webhooks from Discord).
*   **Database:** Google Sheets (stores user data, check-in timestamps, and guild stats).

## ✨ Features
*   **Automated Check-ins:** Guild members can check in directly via a Discord channel.
*   **Real-time Database:** All check-ins are instantly logged to a connected Google Sheet.
*   **Web Dashboard:** A deployed Google Apps Script web app to visualize attendance data.
*   **Zero Hosting Costs:** Fully powered by Google Apps Script and Google Sheets.

## 🚀 Setup & Installation
1.  **Google Sheet Setup:**
    *   Create a new Google Sheet.
    *   Go to `Extensions > Apps Script` and paste the provided `.gs` code.
    *   Deploy as a Web App (Set access to "Anyone").
2.  **Discord Bot Setup:**
    *   Create a bot on the [Discord Developer Portal](https://discord.com/developers/applications).
    *   Set up a webhook or point your bot's interaction endpoint URL to the Apps Script Web App URL.
3.  **Environment Variables:**
    *   Ensure your Apps Script has the correct Discord Bot Token and Google Sheet ID configured.

## 💻 Tech Stack
*   JavaScript (Node.js / Google Apps Script)
*   Discord API
*   Google Sheets API
*   HTML/CSS (for the Web Dashboard)

---
*Created by [earthchawa](https://github.com/earthchawa)
*
