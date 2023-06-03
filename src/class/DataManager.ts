// nodeモジュールをインポート
import { Env } from '@suzuki3jp/utils';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// モジュールをインポート
import {
    CommandsJson,
    ManagersJson,
    ChattersJson,
    PublicCommandsJson,
    SettingsJson,
    StreamStatusJson,
    DotEnv,
} from './JsonTypes';

export class DataManager {
    public _paths: {
        chatters: string;
        cert: string;
        commands: string;
        env: string;
        key: string;
        managers: string;
        publicCommands: string;
        settings: string;
        streamStatus: string;
    };

    constructor() {
        this._paths = {
            chatters: resolve(__dirname, '../../data/Chatters.json'),
            cert: '/etc/letsencrypt/live/api.suzuki3jp.xyz/fullchain.pem',
            commands: resolve(__dirname, '../../data/Commands.json'),
            env: resolve(__dirname, '../../.env'),
            key: '/etc/letsencrypt/live/api.suzuki3jp.xyz/privkey.pem',
            managers: resolve(__dirname, '../../data/Managers.json'),
            publicCommands: resolve(__dirname, '../../data/PublicCommands.json'),
            settings: resolve(__dirname, '../../data/settings.json'),
            streamStatus: resolve(__dirname, '../../data/StreamStatus.json'),
        };
    }

    getChatters(): ChattersJson {
        return this._readFile(this._paths.chatters);
    }

    setChatters(data: string | ChattersJson) {
        this._writeFile(this._paths.chatters, data);
    }

    getCert(): string {
        return readFileSync(this._paths.cert, 'utf-8');
    }

    getCommands(): CommandsJson {
        return this._readFile(this._paths.commands);
    }

    setCommands(data: string | CommandsJson) {
        this._writeFile(this._paths.commands, data);
    }

    setEnv(data: string | DotEnv) {
        if (typeof data === 'string') {
            this._writeFile(this._paths.env, data);
        } else {
            this._writeFile(this._paths.env, Env.parseToEnv(data));
        }
    }

    getKey(): string {
        return readFileSync(this._paths.key, 'utf-8');
    }

    getManagers(): ManagersJson {
        return this._readFile(this._paths.managers);
    }

    setManagers(data: string | ManagersJson) {
        this._writeFile(this._paths.managers, data);
    }

    getPublicCommands(): PublicCommandsJson {
        return this._readFile(this._paths.publicCommands);
    }

    setPublicCommands(data: string | PublicCommandsJson) {
        this._writeFile(this._paths.publicCommands, data);
    }

    getSettings(): SettingsJson {
        return this._readFile(this._paths.settings);
    }

    setSettings(data: string | SettingsJson) {
        this._writeFile(this._paths.settings, data);
    }

    getStreamStatus(): StreamStatusJson {
        return this._readFile(this._paths.streamStatus);
    }

    setStreamStatus(data: string | StreamStatusJson) {
        this._writeFile(this._paths.streamStatus, data);
    }

    _readFile(path: string) {
        return JSON.parse(readFileSync(path, 'utf-8'));
    }

    _writeFile(path: string, data: string | JsonTypes) {
        if (typeof data !== 'string') {
            writeFileSync(path, this._jsonToString(data), 'utf-8');
        } else {
            writeFileSync(path, data, 'utf-8');
        }
    }

    _jsonToString(data: any): string {
        return JSON.stringify(data, null, '\t');
    }
}

type JsonTypes = CommandsJson | ManagersJson | ChattersJson | PublicCommandsJson | SettingsJson | StreamStatusJson;
