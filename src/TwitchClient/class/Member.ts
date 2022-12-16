import type { ChatUser } from '@twurple/chat';
import type { Client } from '../Client';

export class ChannelMember {
    public client: Client;

    /**
     * The name of the member.
     */
    public name: string;

    /**
     * The display name of the member.
     */
    public displayName: string;

    /**
     * The id of the member.
     */
    public id: string;

    /**
     * Whether the member is mod.
     */
    public isMod: boolean;

    /**
     * Whether the member is broadcaster.
     */
    public isBroadCaster: boolean;

    /**
     * Whether the member is founder.
     */
    public isFounder: boolean;

    /**
     * Whether the member is subscriber.
     */
    public isSubscriber: boolean;

    /**
     * Whether the member is vip.
     */
    public isVip: boolean;

    /**
     * Badges of the member.
     */
    public badges: Map<string, string>;

    /**
     * Badge infomation of the member.
     */
    public badgeInfo: Map<string, string>;

    /**
     * The color of the member.
     * May be null when not set.
     */
    public color: string | null;

    constructor(client: Client, userInfo: ChatUser) {
        this.client = client;
        this.id = userInfo.userId;
        this.name = userInfo.userName;
        this.displayName = userInfo.displayName;
        this.isMod = userInfo.isMod;
        this.isVip = userInfo.isVip;
        this.isBroadCaster = userInfo.isBroadcaster;
        this.isFounder = userInfo.isFounder;
        this.isSubscriber = userInfo.isSubscriber;
        this.badges = userInfo.badges;
        this.badgeInfo = userInfo.badgeInfo;
        this.color = userInfo.color ?? null;
    }
}
