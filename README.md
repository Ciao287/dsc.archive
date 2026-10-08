# dsc.archive  (Beta v0.3.0)

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
### Are you lazy?
### Yes
- Join this Discord server: https://discord.gg/UbV46Wqa3D;
- Find the `🛠️⠇try-the-library` channel (send a few messages if there aren't any in the channel);
- Run the `/fetchmessages` command inside the `🛠️⠇try-the-library` channel.

Other ways to test the library (optional):
- 1
  - Invite the bot to your server (if you don't want to join mine): https://discord.com/oauth2/authorize?client_id=1394088761989533780;
  - Run the `/fetchmessages` command anywhere in the server where you added the bot.
- 2
  - Create your own Discord bot and add it to your server;
  - Use my bot's code (which you can find here: https://github.com/Ciao287/dsc.archive-discord-bot) to create your own Discord bot;
  - Modify the code if you want to test specific functions in detail;
  - In this case, you aren't lazy and you know how JavaScript works, so you should head to the "No" section below :).
### No
If you want to quickly try out the library or simply understand how it works, this is the right section for you:
1) if you don't already have it, install [Node.js](https://nodejs.org/en/download/current);
2) create a folder and open it in a terminal;
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
    const result = await fetchMessages(channel, 1);
    console.log(result);
    
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
Currently, the only function in the library is `fetchMessages`, which allows you to fetch messages from a Discord text-based channel, filter them, and return them in a `FetchedMessages` object:
```js
const { fetchMessages } = require('dsc.archive');

fetchMessages(channel, amount?, fields?, options?);
```
`channel` must be a Discord text-based channel;

`amount` must be an integer between 1 and Infinity. The default value is 100;

`fields` can be `true` (all fields will be returned), `undefined` (default fields will be returned), or a non-empty object.
You can see the current default fields here: [DefaultFields](https://github.com/Ciao287/dsc.archive/blob/main/index.d.ts#L12). To see the updated full list of every field available, visit: https://discord.js.org/docs/packages/discord.js/main/Message:Class.

`options` can be `true` (all options will be returned), `false` (none of the options will be returned) or a non-empty object to select which option should be returned.
You can see the option list here: [Options](https://github.com/Ciao287/dsc.archive/blob/main/index.d.ts#L55) and the current default options here: [DefaultOptions](https://github.com/Ciao287/dsc.archive/blob/main/index.d.ts#L82).

The field filtering system works according to a level-based whitelist/blacklist system. If no `false` fields are present in a level, it will be whitelisted, displaying only the fields marked as `true` and/or the nested objects selected at that level.

Here's an example of the FetchedMessages structure:
```js
const result = await fetchMessages(channel, Infinity, true, true);

console.log(result);
```
It will return something similar to this:
```
FetchedMessages {
  messages: [Messages],
  guild: [Guild],
  channel: [TextChannel],
  authors: [Authors],
  interactions: [Interactions],
  webhooks: [Webhooks],
  fetchTimestamp: 1786039623635,
}
```
For an explanation of each of these properties, see [FetchedMessages](https://github.com/Ciao287/dsc.archive/blob/main/index.d.ts#L148).

For `messages`, `authors`, `interactions` and `webhooks`, if the array or map has more than 5 entries, it will be replaced by `[Messages]`, `[Authors]`, `[Interactions]` and `[Webhooks]`, to improve readability. To access the full array/map:
```js
result.messages.raw
result.authors.raw
result.interactions.raw
result.webhooks.raw
```
`guild` and `channel` will always be replaced by `[Guild]` and various tipes of channels (example: `[TextChannel]`). To access them you can just do:
```js
result.guild
result.channel
```
If you want to convert the fetched data into a JSON, you can use the `.toJSON()` method:
```js
result.toJSON(path?, replacer?, space?);
```
`path` The path where the JSON will be written. See [writeFile](https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback).

`replacer` A function that transforms the results. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer).

`space` Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#space).

If you just want to convert the data to JSON without writing it to a file:
```js

const messages = await result.toJSON();

console.log(messages);
```
If you want to write the JSON to a file:
```js
const messages = await result.toJSON('./messages.json'); //This is an example path

console.log(messages); //The method will still return the JSON string even when a file is written, so it can be used normally.
```
Objects from discord.js are converted using their default `.toJSON()` methods, so some objects may not be represented exactly as they appear before being converted to JSON.

Here is a list of all the custom `result` functions I’ve added to help you manage and work with the result, especially when dealing with large amounts of data:
```js
result.size //Alias of `result.messages.length`
result.length //Alias of `result.messages.length`
result.toJSON('PATH', REPLACER, SPACE) //Converts the result to JSON
result.messages.raw
result.messages.get('MESSAGE_ID') //Even though it's not a map, I thought this could be a useful shortcut
result.messages.first(NUMBER) //Get the first message(s) in the array
result.messages.last(NUMBER) //Get the last message(s) in the array
result.authors.raw
result.authors.first(NUMBER) //Get the first author(s) in the map
result.authors.last(NUMBER) //Get the last author(s) in the map
result.interactions.raw
result.interactions.first(NUMBER) //Get the first author(s) that sent messages associated with interactions in the map
result.interactions.last(NUMBER) //Get the last author(s) that sent messages associated with interactions in the map
result.webhooks.raw
result.webhooks.first(NUMBER) //Get the first webhooks(s) in the map
result.webhooks.last(NUMBER) //Get the last webhooks(s) in the map
```

## Roadmap
- [x] Fetch messages and filter them
- [x] Fix some filtering bugs
- [x] Improve fetchMessages
- [x] Export fetched messages as JSON
- [ ] Export fetched messages as TXT
- [ ] Export fetched messages as HTML

## AI Disclaimer
I used AIs like Github Copilot and ChatGPT mainly to speed up programming and solve problems I couldn't identify. I then modified the code generated by the AIs to best fit my code without problems.