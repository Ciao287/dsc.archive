import { TextBasedChannel, Guild, User, GuildMember, Webhook } from "discord.js";

export type Fields = { [field: string]: boolean | Fields; };

export interface Options {
    guild?: boolean;
    channel?: boolean;
    authors?: boolean;
    interactions?: boolean;
    webhooks?: boolean;
};

export interface FetchedMessage { [field: string]: unknown; };

export class Messages extends Array<FetchedMessage> {
    /**
     * Returns the original array of messages without the custom wrapper.
     */
    readonly raw: FetchedMessage[];
    
    /**
     * Get a message in the array.
     * @param id The ID of the message you want to get. 
     */
    get(id: string): FetchedMessage | undefined;
    
    /**
     * Get the first message(s) in the array.
     * @param amount The amount of messages you want. Amount should be an integer greater than 0. Default `1`.
     */
    first(amount?: number): FetchedMessage | FetchedMessage[] | undefined;
    
    /**
     * Get the last message(s) in the array.
     * @param amount The amount of messages you want. Amount should be an integer greater than 0. Default `1`.
     */
    last(amount?: number): FetchedMessage | FetchedMessage[] | undefined;
};

export class BaseMap<T> extends Map<string, T> {
    /**
     * Returns the original map without the custom wrapper.
     */
    readonly raw: Map<string, T>;
    
    /**
     * Get the first entry(s) in the map.
     * @param amount The amount of entries you want. Amount should be an integer greater than 0. Default `1`.
     */
    first(amount?: number): T | Map<string, T> | undefined;
    
    /**
     * Get the last entry(s) in the map.
     * @param amount The amount of entries you want. Amount should be an integer greater than 0. Default `1`.
     */
    last(amount?: number): T | Map<string, T> | undefined;
};

export interface BaseMapData<T> {
    author: T;
    messages: string[];
};

export type Authors = BaseMapData<GuildMember | User>;
export type Interactions = BaseMapData<GuildMember | User>;
export type Webhooks = BaseMapData<Webhook>;

export class FetchedMessages {
    messages: Messages;
    guild: Guild | null;
    channel: TextBasedChannel | null;
    authors: BaseMap<Authors> | null;
    interactions: BaseMap<Interactions> | null;
    webhooks: BaseMap<Webhooks> | null;
    fetchedTimestamp: number;

    /**
     * The number of messages in the messages array.
     */
    readonly length: number;
    
    /**
     * The number of messages in the messages array.
     */
    readonly size: number;
};

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
export function fetchMessages( channel: TextBasedChannel, amount?: number, fields?: true | Fields, options?: boolean | Options): Promise<FetchedMessages>;