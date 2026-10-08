const fs = require("fs").promises;

async function JSONExporter(fetchedMessages, path, replacer, space = 2) {
    const messages = {
        messages: fetchedMessages.messages,
        guild: fetchedMessages.guild,
        channel: fetchedMessages.channel,
        authors: fetchedMessages.authors,
        interactions: fetchedMessages.interactions,
        webhooks: fetchedMessages.webhooks,
        fetchTimestamp: fetchedMessages.fetchTimestamp
    };

    if (!replacer) {
        replacer = (key, value) => {
            if (value instanceof Map) {
                return Object.fromEntries(value);
            };

            return value;
        };
    };

    const json = JSON.stringify(messages, replacer, space);

    if (path) {
        await fs.writeFile(path, json);
    };

    return json
};

module.exports = JSONExporter;