# dsc.archive  (Beta v0.1.0)
Demo: coming soon

**🧪 This library is currently in beta, its functions may change radically between releases.**

A library that allows you to fetch and archive messages from a Discord channel using [discord.js](https://github.com/discordjs/discord.js).

The goal of the project is to be able to export messages into various formats, such as HTML, JSON, and TXT, so that it can help create transcripts for tickets.

## How to install it?
To install it, go to the folder of your Node.js project with which you would like to use the library and run the following command in the terminal:
```bash
npm install dsc.archive
```

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
    channelId: 'ChannelID',
    guildId: 'GuildID',
    createdTimestamp: Timestamp,
    type: 0,
    system: false,
    content: 'message content',
    author: {
      id: 'UserID',
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'Username',
      globalName: 'GlobalName',
      discriminator: '0',
      avatar: 'Avatar',
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
    embeds: {},
    components: {},
    attachments: {},
    stickers: {},
    position: null,
    roleSubscriptionData: null,
    resolved: null,
    editedTimestamp: null,
    reactions: { message: [Message] },
    mentions: {
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
    flags: { bitfield: 0 },
    reference: null,
    interactionMetadata: null,
    interaction: null,
    poll: null,
    messageSnapshots: {},
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
    id: 'MessageID',
    author: {
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'Username',
      globalName: 'GlobalName',
      discriminator: '0',
      avatar: 'Avatar',
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
**Note: An object marked as true will turn a blacklist into a whitelist. I'm currently evaluating how to resolve this in future releases.**

If the `fields` is `true`, it will return all message fields:
```js
const result = await fetchMessages(channel, 1, true)
console.log(result) /* returns something like:
[
  {
    channelId: 'ChannelID',
    guildId: 'GuildID',
    id: 'MessageID',
    createdTimestamp: Timestamp,
    type: 0,
    system: false,
    content: 'message content',
    author: {
      id: 'UserID',
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'Username',
      globalName: 'GlobalName',
      discriminator: '0',
      avatar: 'Avatar',
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
    embeds: {},
    components: {},
    attachments: {},
    stickers: {},
    position: null,
    roleSubscriptionData: null,
    resolved: null,
    editedTimestamp: null,
    reactions: { message: [Message] },
    mentions: {
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
    flags: { bitfield: 0 },
    reference: null,
    interactionMetadata: null,
    interaction: null,
    poll: null,
    messageSnapshots: {},
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
    id: 'MessageID',
    createdTimestamp: Timestamp,
    content: 'message content',
    author: {
      id: 'UserID',
      username: 'Username',
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
- [ ] Fix some filtering bugs
- [ ] Export fetched messages as JSON
- [ ] Export fetched messages as TXT
- [ ] Export fetched messages as HTML

## AI Disclaimer
I used AIs like Github Copilot and ChatGPT mainly to speed up programming and solve problems I couldn't identify. I then modified the code generated by the AIs to best fit my code without problems.