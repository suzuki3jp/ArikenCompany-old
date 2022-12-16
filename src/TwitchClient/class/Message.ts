import { Channel } from './Channel';
import { ChannelMember } from './Member';
import type { PrivateMessage } from '@twurple/chat';
import type { Client } from '../Client';

export class Message {
    public client: Client;

    /**
     * The content of the message.
     */
    public content: string;

    /**
     * The ID of the message.
     */
    public id: string;

    /**
     * The date the message was sent at.
     */
    public sentAt: Date;

    /**
     * The channel on that the message was sent.
     */
    public channel: Channel;

    /**
     * The author that sent the message.
     */
    public author: ChannelMember;

    constructor(client: Client, channelName: string, content: string, message: PrivateMessage) {
        if (!message.channelId) throw new Error('MESSAGE_CHANNELID_IS_NOT_DEFINED');
        this.client = client;
        this.content = content;
        this.id = message.id;
        this.sentAt = message.date;
        this.channel = new Channel(this.client, channelName, message.channelId);
        this.author = new ChannelMember(this.client, message.userInfo);
    }

    /**
     * Reply to the message.
     * @param content The content of reply message.
     */
    reply(content: string) {
        this.client.say(this.channel.name, content, this.id);
    }
}
