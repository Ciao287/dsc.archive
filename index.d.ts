import { TextBasedChannel } from "discord.js";

export type Fields = { [field: string]: boolean | Fields; };

export interface FetchedMessage { [field: string]: unknown; };

/**
 * Fetch messages from a text-based channel. 
 * 
 * @param channel The text-based channel from which you want to fetch messages.
 * @param amount The amount of messages you want to fetch. Amount must be an integer between 1 and Infinity. Default `100`.
 * @param fields Fields to include/exclude from the result. Default `undefined`.
 * If `fields` is omitted (`undefined`), the function returns the following fields:
 * - id
 * - createdTimestamp
 * - content
 * - author.id
 * - author.username
 * - author.bot
 * - author.system
 * - editedTimestamp
 * @returns An array of message objects.
 */

export function fetchMessages( channel: TextBasedChannel, amount?: number, fields?: true | Fields): Promise<FetchedMessage[]>;