function hasTrueFields(fields) {
    for (const field of Object.values(fields)) {
        if ((typeof field !== "boolean" && typeof field !== "object") || (typeof field === "object" && (field === null || Array.isArray(field) || !Object.keys(field).length))) throw new TypeError('Field values must be true, false, or a non-empty object.');
        if (field === true) return true;
    };

    return false;
};

function filterFields(message, fields) {
    if (!message || typeof message !== "object") return {};

    if (fields === true) {
        fields = Object.fromEntries(
            Object.keys(message).map(field => [field, true])
        );
    };

    const hasWhitelist = hasTrueFields(fields);

    const filteredFields = {};

    if (hasWhitelist) {
        for (const [field, value] of Object.entries(fields)) {
            if (!(field in message)) continue;

            if (value === true) {
                if (message[field] && typeof message[field] === "object") {
                    filteredFields[field] = { ...message[field] };
                } else {
                    filteredFields[field] = message[field];
                };
            } else if (value && typeof value === "object" && typeof message[field] === "object") {
                const filteredFields2 = filterFields(message[field], value);
                if (Object.keys(filteredFields2).length) {
                    filteredFields[field] = filteredFields2;
                };
            };
        };
    } else {
        for (const [field, value] of Object.entries(message)) {
            if (!(field in fields)) {
                if (typeof value === "object") {
                    filteredFields[field] = { ...value };
                } else {
                    filteredFields[field] = value;
                };
                continue;
            };

            if (fields[field] === false) continue;

            if (fields[field] && typeof fields[field] === "object" && typeof value === "object") {
                const filteredFields2 = filterFields(value, fields[field]);
                if (Object.keys(filteredFields2).length) {
                    filteredFields[field] = filteredFields2;
                };
            } else {
                filteredFields[field] = value;
            };
        };
    };

    return filteredFields;
};

async function fetchMessages(channel, amount = 100, fields) {
    if (!channel) throw new TypeError(`Channel is not valid.`);
    
    if (typeof channel.isTextBased !== "function") throw new TypeError(`Channel is not valid.`);

    if (!channel.isTextBased()) throw new TypeError(`Channel type "${channel.type}" does not support messages.`);

    if(typeof amount === "boolean") amount = 100;

    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) throw new TypeError(`The message amount must be a positive number.`);

    if (!Number.isInteger(amount)) throw new TypeError(`Amount must be an integer.`);

    const defaultFields = {
        id: true,
        createdTimestamp: true,
        content: true,
        author: {
            id: true,
            username: true,
            bot: true,
            system: true,
        },
        editedTimestamp: true,
    };

    if ((fields !== undefined && fields !== true && typeof fields !== "object") || (typeof fields === "object" && (Array.isArray(fields) || fields === null))) throw new TypeError('Fields must be true, undefined or an object.');

    if (!fields) fields = defaultFields;

    if (typeof fields === "object" && !Object.keys(fields).length) throw new TypeError('Fields object must contain at least one property.')

    let messagesFetched = 0;
    let lastMessageFetched;
    let messages = [];
    while (true) {
        let limit = Math.min(100, amount - messages.length);
        let msg = await channel.messages.fetch({limit: limit, before: lastMessageFetched});
        if (!msg.size) break;

        for (const message of msg.values()){
            const filteredFields = filterFields(message, fields);
            if (Object.keys(filteredFields).length) {
                messages.push(filteredFields);
            };
        };

        messagesFetched += limit;
        lastMessageFetched = msg.last().id;
        if (msg.size < 100) break;
        if (messagesFetched >= amount) break;
    };

    return messages
};

module.exports = { fetchMessages };