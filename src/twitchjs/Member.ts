import type { ChatUser, ChatSubGiftInfo } from '@twurple/chat';
import type { HelixUser } from '@twurple/api';
import { Base } from '../class/Base';

export class BaseUser extends Base {
    /**
     * The id of the user.
     */
    public id: string;

    constructor(base: Base, id: string) {
        super({ base });
        this.id = id;
    }

    /**
     * Get infomation of the user.
     */
    async getInfo(): Promise<HelixUser | null> {
        return await this.twitchApi.users.getUserById(this.id);
    }
}

export class User extends BaseUser {
    /**
     * The name of the user.
     */
    public name: string;

    constructor(base: Base, userId: string, userName: string) {
        super(base, userId);
        this.name = userName;
    }
}

export class ChannelMember extends BaseUser {
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

    constructor(base: Base, userInfo: ChatUser) {
        super(base, userInfo.userId);
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
