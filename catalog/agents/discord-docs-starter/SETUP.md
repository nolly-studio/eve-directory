# Set up Discord Docs Starter

## 1. Install and run

```bash
npm install
npm run dev
```

The dev server includes a local chat, so you can test answers before Discord is connected.

## 2. Create the Discord app

1. Create an application at the [Discord Developer Portal](https://discord.com/developers/applications).
2. Copy the **Public Key** and **Application ID** from General Information, and a **Bot Token** from the Bot tab, into `.env` (see `.env.example`).
3. Deploy, then set the app's **Interactions Endpoint URL** to `https://<your-deployment>/eve/v1/discord`.

## 3. Register the /ask command

```bash
curl -X PUT "https://discord.com/api/v10/applications/$DISCORD_APPLICATION_ID/commands" \
  -H "Authorization: Bot $DISCORD_BOT_TOKEN" -H "Content-Type: application/json" \
  -d '[{"name":"ask","description":"Ask the docs bot","type":1,
    "options":[{"name":"message","description":"Your question","type":3,"required":true}]}]'
```

Invite the bot to your server, then `/ask what are the support hours`.

## 4. Paste your docs

Replace the body of `agent/skills/knowledge.md` with your FAQ. Update the frontmatter `description` so it describes when the bot should reach for it.

## Verify

```bash
npm run eval
```

Evals drive the agent over eve's local HTTP channel — model credentials required, Discord credentials not.
