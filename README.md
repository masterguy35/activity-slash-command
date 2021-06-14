# Activities Slash Command

- YouTube Together
- Poker Night
- Betrayal.io
- Fishington.io

# How to use
Paste your Discord Bot's token and its client ID in `src/settings.json` and run `node .` or `npm start` in your console.

### Guild based method
`index.js`
```diff
- const endpoint = `https://discord.com/api/v8/applications/${settings.clientID}/commands`;
+ const endpoint = `https://discord.com/api/v8/applications/${settings.clientID}/guilds/${settings.guildID}/commands`;
```
`settings.json`
```diff
{
    "token": "DISCORD_BOT_TOKEN_HERE",
    "clientID": "CLIENT_ID_HERE",
+   "guildID": "GUILD_ID_HERE"
}

```
