const util = require("util");
const Messages = require ("./Messages.js");
const Authors = require("./Authors.js");
const Interactions = require("./Interactions.js");
const Webhooks = require("./Webhooks.js");

class FetchedMessages {
    constructor(messages, fetchedTimestamp, options = {}) {
        this.messages = new Messages(messages);
        this.fetchedTimestamp = fetchedTimestamp;
        this.guild = options.guild ?? null;
        this.channel = options.channel ?? null;
        this.authors = options.authors ? new Authors(options.authors) : null;
        this.interactions = options.interactions ? new Interactions(options.interactions) : null;
        this.webhooks = options.webhooks ? new Webhooks(options.webhooks) : null;
    };

    get length() {
        return this.messages.length;
    };

    get size() {
        return this.messages.length;
    };

    [util.inspect.custom](depth, options) {
return `FetchedMessages {
  messages: ${util.inspect(this.messages, options)},
  fetchedTimestamp: ${util.inspect(this.fetchedTimestamp, options)},
  guild: ${this.guild ? options.stylize(`[Guild]`, `special`) : util.inspect(this.guild, options)},
  channel: ${this.channel ? options.stylize(`[${this.channel.constructor.name}]`, `special`) : util.inspect(this.channel, options)},
  authors: ${util.inspect(this.authors, options)},
  interactions: ${util.inspect(this.interactions, options)},
  webhooks: ${util.inspect(this.webhooks, options)}
}`;
    };
};

module.exports = FetchedMessages;