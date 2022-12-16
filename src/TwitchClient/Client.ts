import { Message } from './class/Message';

import { EventEmitter } from 'events';
import { RefreshingAuthProvider } from '@twurple/auth';
import type { RefreshConfig, AccessToken } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import type { UserIdResolvable, HelixPrivilegedUser, HelixUser } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import type { PrivateMessage } from '@twurple/chat';

export class TwitchClient extends EventEmitter {
    /**
     * RefreshingAuthProvider from @twurple/auth.
     * {@link https://twurple.js.org/reference/auth/classes/RefreshingAuthProvider.html AuthProvider docs}
     */
    public _auth: RefreshingAuthProvider;

    /**
     * ApiClient from @twurple/api.
     * {@link https://twurple.js.org/reference/api/classes/ApiClient.html ApiClient docs}
     */
    public _api: ApiClient;

    /**
     * ChatClient from @twurple/chat.
     * {@link https://twurple.js.org/reference/chat/classes/ChatClient.html ChatClient docs}
     */
    public _chat: ChatClient;

    public on<K extends keyof ClientEvents>(events: K, listener: (...args: ClientEvents[K]) => void): this;
    on(events: string, listener: (...args: any[]) => void) {
        return super.on(events, listener);
    }

    constructor(authConfig: AuthConfig, options: ClientOptions) {
        super();
        const refreshConfig: RefreshConfig = {
            clientId: authConfig.clientId,
            clientSecret: authConfig.clientSecret,
            onRefresh: authConfig.onRefresh,
        };
        const accessToken: Omit<AccessToken, 'scope'> = {
            accessToken: authConfig.accessToken,
            refreshToken: authConfig.refreshToken,
            expiresIn: authConfig.expiresIn ?? 0,
            obtainmentTimestamp: authConfig.obtainmentTimestamp ?? 0,
        };

        this._auth = new RefreshingAuthProvider(refreshConfig, accessToken);
        this._chat = new ChatClient({ authProvider: this._auth, channels: options.channels });
        this._api = new ApiClient({ authProvider: this._auth });
        this._chat.connect();

        /* ready */
        this._chat.onRegister(() => {
            super.emit(Events.Ready);
        });

        /* messageCreate */
        this._chat.onMessage((channelName, userName, content, msg) => {
            const message = new Message(this, channelName, content, msg);
            super.emit(Events.MessageCreate, message);
        });
    }

    /**
     * Retrieve information about the logged-in user.
     */
    async getMe(): Promise<HelixPrivilegedUser> {
        return await this._api.users.getMe();
    }

    /**
     * Retrieve user information.
     */
    async getUser(id: UserIdResolvable): Promise<HelixUser | null> {
        return await this._api.users.getUserById(id);
    }

    /**
     * Send a message.
     * @param channelName The name of the channel to that a message will be sent.
     * @param content The content of message to be sent.
     * @param replyTo The message of replying or the id of the message.
     */
    say(channelName: string, content: string, replyTo?: string | PrivateMessage) {
        this._chat.say(channelName, content, { replyTo });
    }
}

export interface AuthConfig {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    /**
     * This value is set to 0, if undefined.
     */
    expiresIn?: number;
    /**
     * This value is set to 0, if undefined.
     */
    obtainmentTimestamp?: number;
    onRefresh?: (tokenInfo: AccessToken) => void;
}

export interface ClientOptions {
    channels: string[];
}

const Events = {
    Ready: 'ready',
    MessageCreate: 'messageCreate',
};

export interface ClientEvents {
    ready: [];
    messageCreate: [message: Message];
}
