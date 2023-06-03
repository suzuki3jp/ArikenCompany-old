import { Channel } from './Channel';
import { ChannelMember } from './Member';
import type { PrivateMessage } from '@twurple/chat';
import { Base } from '../class/Base';

export class Message extends Base {
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
     * The member that sent the message.
     */
    public member: ChannelMember;

    constructor(base: Base, channelName: string, content: string, message: PrivateMessage) {
        super({ base });
        if (!message.channelId) throw new Error('MESSAGE_CHANNELID_IS_NOT_DEFINED');
        this.content = content;
        this.id = message.id;
        this.sentAt = message.date;
        this.channel = new Channel(this, channelName, message.channelId);
        this.member = new ChannelMember(this, message.userInfo);
    }

    /**
     * Reply to the message.
     * @param content The content of reply message.
     */
    reply(content: string) {
        this.twitchChat.say(this.channel.name, content, { replyTo: this.id });
    }
}
