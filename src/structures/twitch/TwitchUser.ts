import { ChatUser } from '@twurple/chat';

import { ArikenCompany } from '../ArikenCompany/ArikenCompany';

export class TwitchUser {
    public id: string;
    public name: string;
    public displayName: string;
    public isBroadCaster: boolean;
    public isMod: boolean;
    public isVip: boolean;

    constructor(private client: ArikenCompany, info: ChatUser) {
        this.id = info.userId;
        this.name = info.userName;
        this.displayName = info.displayName;
        this.isBroadCaster = info.isBroadcaster;
        this.isMod = info.isMod;
        this.isVip = info.isVip;
    }
}
