# Nimble
A Discord bot that plays Nim!

## Setup
To run Nimble you will need to install [Node.js](https://nodejs.org/en/).

### If you wish to use the pre-hosted version of this bot, you can invite it to your server using [this link](https://discord.com/api/oauth2/authorize?client_id=904605503743737868&permissions=397284568064&scope=bot%20applications.commands).

Otherwise, if you wish to host it yourself you can follow the instructions below:

### Bot Setup

You will need to set up a Discord Application, found [here](https://discord.com/developers/applications).

Once you create a new application, go to the *Bot* tab and create a new bot.

Inside the directory you cloned this repository to, run these commands:

Install packages:
- `npm install`

Start bot:
- `npm start`
  
Configuring the bot is easy, just edit the `config.json` found in the root of the project:

Configuration (inside `config.json`):
- `token`: this is the bot token, which can be found under the *Bot* tab in the Discord Application. (DO NOT SHARE THIS WITH ANYONE!)
- `prefix`: can be any character(s) you want; defines the start of a command. (e.g. "~help" or "!help")
- `clientId`: this is the Discord Application's ID, which can be found under the *General Information* tab in the Discord Application.

### Inviting the Bot
```NOTE: You need Administrator permissions in the server you want to add this bot to!```

To invite the bot to your server, go to the *OAuth2* tab and click the "bot" and "applications.commands" checkboxes

In the *OAuth2* tab, make sure to scroll down to the "Bot Permissions" section and select these permissions:
- View Channels
- Send Messages
- Public Threads
- Private Threads
- Send Messages in Threads
- Manage Messages
- Manage Threads
- Embed Links
- Read Message History
- Use Slash Commands

After selecting the permissions, copy the link at the bottom of the *OAuth2* section, and open it.
This will bring up a Discord modal telling you which server to put the bot in, and to accept the required permissions.

After this, the bot should be in your server!

## License
You are free to use this project under the terms defined in the MIT License (included in `LICENSE` file).