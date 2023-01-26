// nodeモジュールをインポート
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// モジュールをインポート
import {
    CommandsJson,
    CooltimeJson,
    ManagersJson,
    MessageCounterJson,
    PublicCommandsJson,
    SettingsJson,
} from '../data/JsonTypes';

export class DataManager {
    public _paths: {
        cert: string;
        commands: string;
        cooltime: string;
        env: string;
        key: string;
        log: string;
        managers: string;
        messageCounter: string;
        publicCommands: string;
        settings: string;
    };

    constructor() {
        this._paths = {
            cert: '/etc/letsencrypt/live/suzuki-dev.com-0001/cert.pem',
            commands: resolve(__dirname, '../data/Commands.json'),
            cooltime: resolve(__dirname, '../data/Cooltime.json'),
            env: resolve(__dirname, '../../.env'),
            key: '/etc/letsencrypt/live/suzuki-dev.com-0001/privkey.pem',
            log: resolve(__dirname, '../data/log/log.csv'),
            managers: resolve(__dirname, '../data/Managers.json'),
            messageCounter: resolve(__dirname, '../data/MessageCounter.json'),
            publicCommands: resolve(__dirname, '../data/PublicCommands.json'),
            settings: resolve(__dirname, '../data/settings.json'),
        };
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

    getCooltime(): CooltimeJson {
        return this._readFile(this._paths.cooltime);
    }

    setCooltime(data: string | CooltimeJson) {
        this._writeFile(this._paths.cooltime, data);
    }

    setEnv(data: string) {
        this._writeFile(this._paths.env, data);
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

    getMessageCounter(): MessageCounterJson {
        return this._readFile(this._paths.messageCounter);
    }

    setMessageCounter(data: string | MessageCounterJson) {
        this._writeFile(this._paths.messageCounter, data);
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

type JsonTypes = CommandsJson | CooltimeJson | ManagersJson | MessageCounterJson | PublicCommandsJson | SettingsJson;
