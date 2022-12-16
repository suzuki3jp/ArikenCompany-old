import { Channel } from './Channel';
import { ChannelMember } from './Member';

import type { UserNotice, ChatSubInfo } from '@twurple/chat';
import type { TwitchClient } from '../Client';

export class Subscribe {
    public client: TwitchClient;

    /**
     * Subscribed channel.
     */
    public channel: Channel;

    /**
     * The member that subscribed.
     */
    public author: ChannelMember;

    /**
     * The message content sent with subscribe.
     * This value will be null if nothing is sent.
     */
    public subMessage: string | null;

    /**
     * The total number of subscribe months.
     */
    public totalMonth: number;

    /**
     * The number of consecutive subscribe months.
     */
    public streak: number;

    /**
     * The plan name of the subscribe.
     */
    public planName: string;

    /**
     * Whether the subscibe is by Amazon Prime.
     */
    public isPrime: boolean;

    constructor(client: TwitchClient, channelName: string, subInfo: ChatSubInfo, message: UserNotice) {
        if (!message.channelId) throw Error('CHANNEL_ID_IS_NOT_DEFINED');
        this.client = client;
        this.channel = new Channel(this.client, channelName, message.channelId);
        this.author = new ChannelMember(this.client, message.userInfo);
        this.totalMonth = subInfo.months;
        this.streak = subInfo.streak ?? 1;
        this.subMessage = subInfo.message ?? null;
        this.planName = subInfo.planName;
        this.isPrime = subInfo.isPrime;
    }
}
