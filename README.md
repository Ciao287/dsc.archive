# dsc.archive  (Beta v0.1.2)

**🧪 This library is currently in beta, its functions may change radically between releases.**

A library that allows you to fetch and archive messages from a Discord channel using [discord.js](https://github.com/discordjs/discord.js).

The goal of the project is to be able to export messages into various formats, such as HTML, JSON, and TXT, so that it can help create transcripts for tickets.

## How to install it?
To install it, go to the folder of your Node.js project where you would like to use the library and run the following command in the terminal:
```bash
npm install dsc.archive
```
**Compatibility:** This library is compatible with all **discord.js v14** versions. However, it's recommended to use the latest v14 release.

## Quick setup guide
If you want to quickly try out the library or simply understand how it works, this is the right section for you:
1) if you don't already have it, install [Node.js](https://nodejs.org/en/download/current);
2) create a folder and open it in terminal;
3) run in the terminal:
```bash
npm init -y
npm i dsc.archive
```
4) create a file called `index.js` and paste this code into it:
```js
const { Client } = require('discord.js');
const { fetchMessages } = require("dsc.archive");

const client = new Client({ intents: [] });

client.login("YOUR_BOT_TOKEN").then(async () => {
    const channel = await client.channels.fetch("CHANNEL_ID");
    const messages = await fetchMessages(channel, 1);
    console.log(messages);
    
    process.exit(0);
});
```
5) replace:
   - `YOUR_BOT_TOKEN` with the token of the Discord bot you want to test the library with (create an application if you don't already have one): https://discord.com/developers/applications/,
   - `CHANNEL_ID` with the ID of a Discord channel your bot has access to;
6) make sure that the bot has the `Message Content Intent` enabled and the permission to view and read message history in the channel;
7) run in the terminal:
```bash
node .
```
Keep reading below to learn how to use all the available features.

## How to use it?
### fetchMessages()
Currently, the only function in the library is fetchMessages, which allows you to fetch a certain number of messages from a channel that supports messages, returning only the selected values ​​of those messages:
```js
const { fetchMessages } = require('dsc.archive');

fetchMessages(channel, amount?, fields?);
/*
channel must be a Discord text-based channel;
amount must be an integer between 1 and Infinity. The default if no value is entered is 100;
fields can be true (all fields will be returned), undefined (default fields will be returned), or a non-empty object;
the default fields if nothing is entered are:
id: true,
createdTimestamp: true,
content: true,
author: {
    id: true,
    username: true,
    bot: true,
    system: true,
},
editedTimestamp: true.

For a complete list of Discord message properties, see: https://docs.discord.com/developers/resources/message
*/
```
The field filtering system works according to a level-based whitelist/blacklist system. If at least one `true` field is present in a level, it will be whitelisted, displaying only the fields marked as `true` for that level.
```js
const result = await fetchMessages(channel, 1, {id: true})
console.log(result) // returns something like: [ { id: 'MessageID' } ]
```
If a level only contains `false` fields, it will be blacklisted, showing all fields except those selected as `false`:
```js
const result = await fetchMessages(channel, 1, {id: false})
console.log(result) /* returns something like:
[
  {
    channelId: '1040728682286821490',
    guildId: '1040728681842229299',
    createdTimestamp: 1784674774982,
    type: 0,
    system: false,
    content: 'UwU',
    author: User {
      id: '687333016921440317',
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'ciao287',
      globalName: 'Ciao287',
      discriminator: '0',
      avatar: '13aef81433f5bbd486a0e591bd6d2d80',
      banner: null,
      accentColor: null,
      avatarDecoration: null,
      avatarDecorationData: [Object],
      collectibles: [Object],
      primaryGuild: [Object]
    },
    pinned: false,
    tts: false,
    nonce: null,
    embeds: [],
    components: [],
    attachments: Collection(0) [Map] {},
    stickers: Collection(0) [Map] {},
    position: null,
    roleSubscriptionData: null,
    resolved: null,
    editedTimestamp: null,
    reactions: ReactionManager { message: [Message] },
    mentions: MessageMentions {
      everyone: false,
      users: Collection(0) [Map] {},
      roles: Collection(0) [Map] {},
      _members: null,
      _channels: null,
      _parsedUsers: null,
      crosspostedChannels: Collection(0) [Map] {},
      repliedUser: null
    },
    webhookId: null,
    groupActivityApplication: null,
    applicationId: null,
    activity: null,
    flags: MessageFlagsBitField { bitfield: 0 },
    reference: null,
    interactionMetadata: null,
    interaction: null,
    poll: null,
    messageSnapshots: Collection(0) [Map] {},
    call: null,
    sharedClientTheme: null
  }
]
*/
```
Whitelists and blacklists can be used at different levels:
```js
const result = await fetchMessages(channel, 1, {id: true, author: {id: false}})
console.log(result) /* returns something like:
[
  {
    id: '1529261588404637718',
    author: {
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'ciao287',
      globalName: 'Ciao287',
      discriminator: '0',
      avatar: '13aef81433f5bbd486a0e591bd6d2d80',
      banner: null,
      accentColor: null,
      avatarDecoration: null,
      avatarDecorationData: [Object],
      collectibles: [Object],
      primaryGuild: [Object]
    }
  }
]
*/
```
If the `fields` is `true`, it will return all message fields:
```js
const result = await fetchMessages(channel, 1, true)
console.log(result) /* returns something like:
[
  {
    channelId: '1040728682286821490',
    guildId: '1040728681842229299',
    id: '1529261588404637718',
    createdTimestamp: 1784674774982,
    type: 0,
    system: false,
    content: 'UwU',
    author: User {
      id: '687333016921440317',
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'ciao287',
      globalName: 'Ciao287',
      discriminator: '0',
      avatar: '13aef81433f5bbd486a0e591bd6d2d80',
      banner: null,
      accentColor: null,
      avatarDecoration: null,
      avatarDecorationData: [Object],
      collectibles: [Object],
      primaryGuild: [Object]
    },
    pinned: false,
    tts: false,
    nonce: null,
    embeds: [],
    components: [],
    attachments: Collection(0) [Map] {},
    stickers: Collection(0) [Map] {},
    position: null,
    roleSubscriptionData: null,
    resolved: null,
    editedTimestamp: null,
    reactions: ReactionManager { message: [Message] },
    mentions: MessageMentions {
      everyone: false,
      users: Collection(0) [Map] {},
      roles: Collection(0) [Map] {},
      _members: null,
      _channels: null,
      _parsedUsers: null,
      crosspostedChannels: Collection(0) [Map] {},
      repliedUser: null
    },
    webhookId: null,
    groupActivityApplication: null,
    applicationId: null,
    activity: null,
    flags: MessageFlagsBitField { bitfield: 0 },
    reference: null,
    interactionMetadata: null,
    interaction: null,
    poll: null,
    messageSnapshots: Collection(0) [Map] {},
    call: null,
    sharedClientTheme: null
  }
]
*/
```
If fields is not entered or is entered as `undefined`:
```js
const result = await fetchMessages(channel, 1)
console.log(result) /* returns something like:
[
  {
    id: '1529261588404637718',
    createdTimestamp: 1784674774982,
    content: 'UwU',
    author: {
      id: '687333016921440317',
      username: 'ciao287',
      bot: false,
      system: false
    },
    editedTimestamp: null
  }
]
*/
```

## Roadmap
- [x] Fetch messages and filter them
- [x] Fix some filtering bugs
- [ ] Export fetched messages as JSON
- [ ] Export fetched messages as TXT
- [ ] Export fetched messages as HTML

## AI Disclaimer
I used AIs like Github Copilot and ChatGPT mainly to speed up programming and solve problems I couldn't identify. I then modified the code generated by the AIs to best fit my code without problems.