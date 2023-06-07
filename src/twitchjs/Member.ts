import type { ChatUser } from '@twurple/chat';
import type { HelixUser } from '@twurple/api';
import { ArikenCompany } from '../ArikenCompany';

export class BaseUser extends ArikenCompany {
    /**
     * The id of the user.
     */
    public id: string;

    constructor(app: ArikenCompany, id: string) {
        super(app);
        this.id = id;
    }

    /**
     * Get infomation of the user.
     */
    async getInfo(): Promise<HelixUser | null> {
        return await this.client.twitch.api.users.getUserById(this.id);
    }
}

export class User extends BaseUser {
    /**
     * The name of the user.
     */
    public name: string;

    constructor(app: ArikenCompany, userId: string, userName: string) {
        super(app, userId);
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

    constructor(app: ArikenCompany, userInfo: ChatUser) {
        super(app, userInfo.userId);
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
